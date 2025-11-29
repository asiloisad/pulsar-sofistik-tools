/** @babel */
/** @jsx etch.dom */

const etch = require("etch");
const { CompositeDisposable } = require("atom");
const SelectListView = require("atom-select-list");
const fs = require("fs");
const path = require("path");
const { shell } = require("electron");

module.exports = class HelpList {
  constructor(S) {
    this.S = S;
    this.items = null;
    this.query = "";

    this.slv = new SelectListView({
      items: [],
      maxResults: 50,
      emptyMessage: <div class="empty-message">No matches found</div>,
      elementForItem: (item, props) => {
        let li, priBlock, matches;
        li = document.createElement("li");
        if (!props.visible) {
          return li;
        }
        li.classList.add("event", "two-lines");
        priBlock = document.createElement("div");
        priBlock.classList.add("primary-line");
        matches =
          this.query.length > 0
            ? atom.ui.fuzzyMatcher.match(item.displayName, this.query, {
                recordMatchIndexes: true,
              }).matchIndexes
            : [];
        this.highlightMatchesInElement(item.displayName, matches, priBlock);
        li.appendChild(priBlock);
        li.addEventListener("contextmenu", () => {
          this.slv.selectIndex(props.index);
        });
        return li;
      },
      didConfirmSelection: () => {
        this.didConfirmSelection();
      },
      didCancelSelection: () => {
        this.hide();
      },
      filter: (items, query) => {
        if (query.length === 0) {
          this.query = query;
          this.qdest = false;
          return items;
        }
        let colon = query.indexOf(":");
        if (colon !== -1) {
          this.query = query.slice(0, colon);
          this.qdest = query.substring(colon + 1);
        } else {
          this.query = query;
          this.qdest = false;
        }
        let scoredItems = [];
        for (let item of items) {
          item.score = atom.ui.fuzzyMatcher.score(item.displayName, this.query);
          if (item.score > 0) {
            scoredItems.push(item);
          }
        }
        return scoredItems.sort((a, b) => b.score - a.score);
      },
    });
    this.slv.element.classList.add("command-palette");
    this.slv.element.classList.add("sofistik-tools");
    this.slv.element.classList.add("help-list");

    this.disposables = new CompositeDisposable();
    this.disposables.add(
      atom.commands.add(this.slv.element, {
        "help-list:open-in": () => this.didConfirmSelection(null, "open-in"),
        "help-list:open-ex": () => this.didConfirmSelection(null, "open-ex"),
      }),
      atom.config.observe("command-palette.preserveLastSearch", (value) => {
        this.preserveLastSearch = value;
      }),
      atom.config.observe("sofistik-tools.showKeystrokes", (value) => {
        this.showKeystrokes = value;
        this.slv.update({ infoMessage: this.getInfoMessage() });
      }),
      atom.config.observe("language-sofistik.version", () => {
        this.items = null;
      }),
      atom.commands.add("atom-workspace", {
        "sofistik-tools:toggle-help": () => this.toggle(),
        "sofistik-tools:cache-help": () => {
          this.items = null;
          this.update();
        },
      })
    );
  }

  destroy() {
    this.disposables.dispose();
    this.slv.destroy();
  }

  show() {
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({ item: this.slv });
    }
    this.previouslyFocusedElement = document.activeElement;
    this.update();
    if (this.preserveLastSearch) {
      this.slv.refs.queryEditor.selectAll();
    } else {
      this.slv.reset();
    }
    this.panel.show();
    this.slv.focus();
  }

  hide() {
    this.panel.hide();
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }

  toggle() {
    if (this.panel && this.panel.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  update() {
    if (!this.items || this.sofPath !== this.S.getSofPath()) {
      let lang = "English";
      let reTest;
      if (lang == "English") {
        reTest = /^[^\n0]+\.pdf$/i;
      } else if (lang == "Germany") {
        reTest = /^[^\n1]+\.pdf$/i;
      }
      this.sofPath = this.S.getSofPath();
      let files = fs.readdirSync(this.sofPath);
      let filesSorted = [];
      for (let fileName of files) {
        if (fileName.match(reTest)) {
          filesSorted.push({
            fileName: fileName,
            displayName: fileName.match(/(.+?)(_.)?.pdf/i)[1].toUpperCase(),
          });
        }
      }
      this.items = filesSorted;
      this.slv.update({ items: this.items });
    }
  }

  highlightMatchesInElement(text, matches, el) {
    let matchedChars = [];
    let lastIndex = 0;
    for (const matchIndex of matches) {
      const unmatched = text.substring(lastIndex, matchIndex);
      if (unmatched) {
        if (matchedChars.length > 0) {
          const matchSpan = document.createElement("span");
          matchSpan.classList.add("character-match");
          matchSpan.textContent = matchedChars.join("");
          el.appendChild(matchSpan);
          matchedChars = [];
        }
        el.appendChild(document.createTextNode(unmatched));
      }
      matchedChars.push(text[matchIndex]);
      lastIndex = matchIndex + 1;
    }
    if (matchedChars.length > 0) {
      const matchSpan = document.createElement("span");
      matchSpan.classList.add("character-match");
      matchSpan.textContent = matchedChars.join("");
      el.appendChild(matchSpan);
    }
    const unmatched = text.substring(lastIndex);
    if (unmatched) {
      el.appendChild(document.createTextNode(unmatched));
    }
  }

  didConfirmSelection(item, mode) {
    if (!item) {
      item = this.slv.getSelectedItem();
    }
    if (!item) {
      return;
    } else {
      this.hide();
    }
    if (!mode) {
      mode = "open-in";
    }
    let filePath = path.join(this.sofPath, item.fileName);
    if (mode === "open-in") {
      if (this.qdest) {
        filePath += `#nameddest=${this.qdest
          .toUpperCase()
          .trim()
          .replace(/ /g, "")}`;
      }
      atom.workspace.open(filePath);
    } else if (mode === "open-ex") {
      shell.openPath(filePath);
    }
  }

  getInfoMessage() {
    return this.showKeystrokes
      ? [
          "Press ",
          <span class="keystroke">Enter</span>,
          " or ",
          <span class="keystroke">Alt-Enter</span>,
        ]
      : null;
  }
};
