/** @babel */
/** @jsx etch.dom */

const etch = require('etch')
const { CompositeDisposable } = require('atom')
const SelectListView = require('atom-select-list')

module.exports = class VerssionList {

  constructor () {
    this.items = null

    this.slv = new SelectListView({
      items: [],
      maxResults: 50,
      emptyMessage: <div class='empty-message'>No matches found</div>,
      elementForItem: (item, {_, index, visible}) => {
        let li, priBlock, query, matches
        li = document.createElement('li')
        if (!visible) { return li }
        li.classList.add('event', 'two-lines')
        priBlock = document.createElement('div')
        priBlock.classList.add('primary-line')
        query = this.slv.getQuery()
        matches = query.length>0 ? atom.ui.fuzzyMatcher.match(item.version, query, { recordMatchIndexes:true }).matchIndexes : []
        this.highlightMatchesInElement(item.version, matches, priBlock)
        li.appendChild(priBlock)
        li.addEventListener('contextmenu', () => { this.slv.selectIndex(index) })
        return li
      },
      didConfirmSelection: (item) => {
        this.hide()
        atom.config.set('sofistik-tools.version', item.version)
      },
      didCancelSelection: () => { this.hide() },
      filter: (items, query) => {
        if (query.length===0) { return items }
        let scoredItems = []
        for (let item of items) {
          item.score = atom.ui.fuzzyMatcher.score(item.version, query)
          if (item.score>0) { scoredItems.push(item) }
        }
        return scoredItems.sort((a,b) => b.score-a.score)
      },
    })
    this.slv.element.classList.add('command-palette')
    this.slv.element.classList.add('sofistik-tools')
    this.slv.element.classList.add('sofistik-version')

    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.config.observe('command-palette.preserveLastSearch', (value) => {
        this.preserveLastSearch = value
      }),
      atom.commands.add('atom-workspace', {
        'sofistik-tools:change-version': () => this.toggle(),
      }),
    )
  }

  destroy() {
    this.disposables.dispose()
    this.slv.destroy()
  }

  show() {
    if (!this.panel) {this.panel = atom.workspace.addModalPanel({item: this.slv})}
    this.previouslyFocusedElement = document.activeElement
    this.update()
    if (this.preserveLastSearch) {
      this.slv.refs.queryEditor.selectAll()
    } else {
      this.slv.reset()
    }
    this.panel.show()
    this.slv.focus()
  }

  hide() {
    this.panel.hide()
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }

  toggle() {
    if (this.panel && this.panel.isVisible()) {
      this.hide()
    } else {
      this.show()
    }
  }

  update() {
    if (!this.items) {
      this.items = [
        { version:'2026' },
        { version:'2025' },
        { version:'2024' },
        { version:'2023' },
        { version:'2022' },
        { version:'2020' },
        { version:'2018' },
      ]
      this.slv.update({ items:this.items })
    }
  }

  highlightMatchesInElement(text, matches, el) {
    let matchedChars = []
    let lastIndex = 0
    for (const matchIndex of matches) {
      const unmatched = text.substring(lastIndex, matchIndex)
      if (unmatched) {
        if (matchedChars.length > 0) {
          const matchSpan = document.createElement('span')
          matchSpan.classList.add('character-match')
          matchSpan.textContent = matchedChars.join('')
          el.appendChild(matchSpan)
          matchedChars = []
        }
        el.appendChild(document.createTextNode(unmatched))
      }
      matchedChars.push(text[matchIndex])
      lastIndex = matchIndex + 1
    }
    if (matchedChars.length > 0) {
      const matchSpan = document.createElement('span')
      matchSpan.classList.add('character-match')
      matchSpan.textContent = matchedChars.join('')
      el.appendChild(matchSpan)
    }
    const unmatched = text.substring(lastIndex)
    if (unmatched) {
      el.appendChild(document.createTextNode(unmatched))
    }
  }
}
