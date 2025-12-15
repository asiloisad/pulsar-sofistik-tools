const { CompositeDisposable } = require("atom");
const {
  SelectListView,
  createTwoLineItem,
  highlightMatches,
} = require("pulsar-select-list");

module.exports = class VersionList {
  constructor() {
    this.items = null;
    this.selectList = new SelectListView({
      items: [],
      maxResults: 50,
      className: "sofistik-tools version-list",
      emptyMessage: "No matches found",
      filterKeyForItem: (item) => item.version,
      willShow: () => this.update(),
      elementForItem: (item, options) => {
        const matches = this.selectList.getMatchIndices(item) || [];
        return createTwoLineItem({
          primary: highlightMatches(item.version, matches),
        });
      },
      didConfirmSelection: (item) => {
        this.selectList.hide();
        atom.config.set("language-sofistik.version", item.version);
      },
      didCancelSelection: () => this.selectList.hide(),
    });
    this.disposables = new CompositeDisposable();
    this.disposables.add(
      atom.commands.add("atom-workspace", {
        "sofistik-tools:change-version": () => this.selectList.toggle(),
      })
    );
  }

  destroy() {
    this.disposables.dispose();
    this.selectList.destroy();
  }

  update() {
    if (!this.items) {
      this.items = [
        { version: "Auto" },
        { version: "2026" },
        { version: "2025" },
        { version: "2024" },
        { version: "2023" },
        { version: "2022" },
        { version: "2020" },
        { version: "2018" },
      ];
      this.selectList.update({ items: this.items });
    }
  }
};
