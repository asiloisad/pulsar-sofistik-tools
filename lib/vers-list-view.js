'use babel'

import { CompositeDisposable } from 'atom'
import SelectListView from 'atom-select-list'
import fuzzaldrin     from 'fuzzaldrin'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

export default class VersListView {

  constructor () {
    this.items = null
    this.selectListView = new SelectListView({

      items: [],

      emptyMessage: ' [NO MATCHES FOUND]',

      infoMessage: 'Press Enter or Alt-Enter',

      elementForItem: (item) => {
        li = document.createElement('li')
        li.classList.add('event', 'two-lines')
        nameBlock = document.createElement('div')
        nameBlock.classList.add('primary-line')
        this.highlightMatchesInElement(item, this.selectListView.getQuery(), nameBlock)
        li.appendChild(nameBlock)
        return li
      },

      didConfirmSelection: (item) => {
        this.hide()
        atom.config.set('sofistik-tools.version', item)
      },

      didCancelSelection: () => { this.hide() },

      filter: (items, query) => {
        if (query.length===0) { return items }
        scoredItems = []
        for (let item of items) {
          item.score = this.fuzz.score(item, query)
          if (item.score<=0) { continue }
          scoredItems.push(item)
        }
        return scoredItems.sort((a,b) => b.score-a.score)
      },
    })

    this.selectListView.element.classList.add('command-palette')
    this.selectListView.element.classList.add('sofistik-tools')
    this.selectListView.element.classList.add('sofistik-version')

    this.disposables = new CompositeDisposable()

    this.disposables.add(
      atom.config.observe('command-palette.useAlternateScoring', (value) => {
        this.useAlternateScoring = value
      }),
      atom.config.observe('command-palette.preserveLastSearch', (value) => {
        this.preserveLastSearch = value
      }),
      atom.commands.add('atom-workspace', {
        'SOFiSTiK-tools:change-version': () => this.toggle(),
      }),
    )
  }

  destroy() {
    this.disposables.dispose()
    this.selectListView.destroy()
  }

  show() {
    if (!this.panel) {this.panel = atom.workspace.addModalPanel({item: this.selectListView})}
    this.previouslyFocusedElement = document.activeElement
    this.update()
    if (this.preserveLastSearch) {
      this.selectListView.refs.queryEditor.selectAll()
    } else {
      this.selectListView.reset()
    }
    this.panel.show()
    this.selectListView.focus()
  }

  hide() {
    this.panel.hide()
    this.previouslyFocusedElement.focus()
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
      this.items = ['2022', '2020', '2018']
      this.selectListView.update({items:this.items})
    }
  }

  get fuzz () {
    return this.useAlternateScoring ? fuzzaldrinPlus : fuzzaldrin
  }

  highlightMatchesInElement(text, query, el) {
    const matches = this.fuzz.match(text, query)
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
