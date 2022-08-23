'use babel'
/** @jsx etch.dom */
const etch = require('etch')

import { CompositeDisposable } from 'atom'
import SelectListView from 'atom-select-list'
const zadeh     = require("zadeh")
const fs        = require("fs")
const path      = require('path')
const { shell } = require('electron')

export default class HelpListView {

  constructor (S) {
    this.S = S
    this.items = null

    this.selectListView = new SelectListView({

      items: [],

      maxResults: 50,

      emptyMessage: <div class='empty-message'>No matches found</div>,

      infoMessage: ['Press ', <span class='keystroke'>Enter</span>, ' or ', <span class='keystroke'>Alt-Enter</span>],

      elementForItem: (item, {selected, index, visible}) => {
        li = document.createElement('li')
        if (!visible) { return li }
        li.classList.add('event', 'two-lines')
        query = this.selectListView.getQuery()
        priBlock = document.createElement('div')
        priBlock.classList.add('primary-line')
        matches = query.length>0 ? zadeh.match(item.displayName, query) : []
        this.highlightMatchesInElement(item.displayName, matches, priBlock)
        li.appendChild(priBlock)
        li.addEventListener('contextmenu', () => { this.selectListView.selectIndex(index) })
        return li
      },

      didConfirmSelection: () => { this.didConfirmSelection('open-in') },

      didCancelSelection: () => { this.hide() },

      filter: (items, query) => {
        if (query.length===0) { return items }
        scoredItems = []
        for (let item of items) {
          item.score = zadeh.score(item.displayName, query)
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
