'use babel'

import { CompositeDisposable } from 'atom'
import SelectListView from 'atom-select-list'
import fuzzaldrin     from 'fuzzaldrin'
import fuzzaldrinPlus from 'fuzzaldrin-plus'
const fs        = require("fs")
const path      = require('path');
const { shell } = require('electron')

export default class HelpListView {

  constructor (S) {
    this.S = S
    this.items = null

    this.selectListView = new SelectListView({

      items: [],

      maxResults: 50,

      emptyMessage: ' [NO MATCHES FOUND]',

      infoMessage: 'Press Enter or Alt-Enter',

      elementForItem: (item, {_, _, visible}) => {
        if (!visible) { return document.createElement("li") }
        query = this.selectListView.getQuery()
        li = document.createElement('li')
        li.classList.add('event', 'two-lines')
        nameBlock = document.createElement('div')
        nameBlock.classList.add('primary-line')
        this.highlightMatchesInElement(item.displayName, query, nameBlock)
        li.appendChild(nameBlock)
        return li
      },

      didCancelSelection: () => { this.hide() },

      filter: (items, query) => {
        if (query.length===0) { return items }
        scoredItems = []
        for (let item of items) {
          item.score = this.fuzz.score(item.displayName, query)
          if (item.score<=0) { continue }
          scoredItems.push(item)
        }
        return scoredItems.sort((a,b) => b.score-a.score)
      },
    })

    this.selectListView.element.classList.add('command-palette')
    this.selectListView.element.classList.add('sofistik-tools')
    this.selectListView.element.classList.add('sofistik-help')

    this.disposables = new CompositeDisposable()

    this.disposables.add(
      atom.commands.add(this.selectListView.element, {
        'SOFiSTiK-help:open-in': () => this.didConfirmSelection('open-in'),
        'SOFiSTiK-help:open-ex': () => this.didConfirmSelection('open-ex'),
      }),
      atom.config.observe('command-palette.useAlternateScoring', (value) => {
        this.useAlternateScoring = value
      }),
      atom.config.observe('command-palette.preserveLastSearch', (value) => {
        this.preserveLastSearch = value
      }),
      atom.commands.add('atom-workspace', {
        'SOFiSTiK-tools:toggle-help'   : () => this.toggle(),
        'SOFiSTiK-tools:recache-help': () => { this.items=null ; this.update() },
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
      lang = atom.config.get('sofistik-tools.lang')
      if (lang=='English') {
        test = /^[^\n0]+\.pdf$/i
      } else if (lang=='Germany') {
        test = /^[^\n1]+\.pdf$/i
      }
      this.sofPath = this.S.getSofPath()
      files = fs.readdirSync(this.sofPath);
      filesSorted = []
      for (let fileName of files) {
        if (fileName.match(test)) {
          filesSorted.push({
            fileName: fileName,
            displayName: fileName.match(/(.+?)(_.)?.pdf/i)[1].toUpperCase(),
          })
        }
      }
      this.items = filesSorted
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

  didConfirmSelection(mode) {
    item = this.selectListView.getSelectedItem()
    if (item) { this.hide() } else { return }
    filePath = path.join(this.sofPath, item.fileName)
    if (mode==='open-in') {
      atom.workspace.open(filePath)
    } else if (mode==='open-ex') {
      shell.openPath(filePath)
    }
  }

}
