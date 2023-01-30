'use babel'
/** @jsx etch.dom */
const etch = require('etch')

import { CompositeDisposable } from 'atom'
import SelectListView from 'atom-select-list'
const zadeh = require("zadeh")

export default class VersListView {

  constructor () {
    this.items = null
    this.selectListView = new SelectListView({

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
        query = this.selectListView.getQuery()
        matches = query.length>0 ? zadeh.match(item.version, query) : []
        this.highlightMatchesInElement(item.version, matches, priBlock)
        li.appendChild(priBlock)
        li.addEventListener('contextmenu', () => { this.selectListView.selectIndex(index) })
        return li
      },

      didConfirmSelection: (item) => {
        this.hide()
        atom.config.set('sofistik-tools.version', item)
      },

      didCancelSelection: () => { this.hide() },

      filter: (items, query) => {
        if (query.length===0) { return items }
        let scoredItems = []
        for (let item of items) {
          item.score = zadeh.score(item.version, query)
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
      this.items = [{version:'2023'}, {version:'2022'}, {version:'2020'}, {version:'2018'}]
      this.selectListView.update({items:this.items})
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
