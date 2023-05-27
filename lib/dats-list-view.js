'use babel'
/** @jsx etch.dom */
const etch = require('etch')

import { CompositeDisposable } from 'atom'
import SelectListView from 'atom-select-list'
import zadeh from "zadeh"
import glob from 'glob'
import path from 'path'
import { shell } from 'electron'

export default class DatsListView {

  constructor (S) {
    this.S = S ; this.items = null

    this.selectListView = new SelectListView({
      items: [],
      maxResults: 50,
      emptyMessage: <div class='empty-message'>No matches found</div>,
      infoMessage: ['Press ', <span class='keystroke'>Enter</span>, ' or ', <span class='keystroke'>Alt-Enter</span>],
      elementForItem: (item, {_, index, visible}) => {
        let li, query, matches, total, priBlock
        li = document.createElement('li')
        if (!visible) { return li }
        li.classList.add('event', 'two-lines')
        query = this.selectListView.getQuery()
        matches = query.length>0 ? zadeh.match(item.text, query) : []
        total = 0
        priBlock = document.createElement('div')
        priBlock.classList.add('primary-line')
        let progBlock = document.createElement('span')
        progBlock.classList.add('prog')
        total += 1
        this.highlightMatchesInElement(item.prog, matches.map(x=>x-total), progBlock)
        total += 1 + item.prog.length
        priBlock.appendChild(progBlock)
        this.highlightMatchesInElement(item.title, matches.map(x=>x-total), priBlock)
        li.appendChild(priBlock)
        li.addEventListener('contextmenu', () => { this.selectListView.selectIndex(index) })
        return li
      },
      didConfirmSelection: () => { this.didConfirmSelection() },
      didCancelSelection: () => { this.hide() },
      filter: (items, query) => {
        if (query.length===0) { return items }
        let scoredItems = []
        for (let item of items) {
          item.score = zadeh.score(item.text, query)
          if (item.score<=0) { continue }
          scoredItems.push(item)
        }
        return scoredItems.sort((a,b) => b.score-a.score)
      },
    })
    this.selectListView.element.classList.add('command-palette')
    this.selectListView.element.classList.add('sofistik-tools')
    this.selectListView.element.classList.add('sofistik-dats')

    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.commands.add(this.selectListView.element, {
        'SOFiSTiK-dats:open': () => this.didConfirmSelection(),
      }),
      atom.config.observe('command-palette.preserveLastSearch', (value) => {
        this.preserveLastSearch = value
      }),
      atom.commands.add('atom-workspace', {
        'SOFiSTiK-tools:toggle-dats' : () => this.toggle(),
        'SOFiSTiK-tools:recache-dats': () => { this.items=null ; this.update() },
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
      let lang = atom.config.get('sofistik-tools.lang')
      this.sofPath = this.S.getSofPath()
      let filesSorted = [] ; let parts ; let prog ; let title ; let i
      glob('*.dat/**/*.dat', {cwd:this.sofPath, nosort:true, silent:true, nodir:true}, (_, files) => {
        for (let file of files) {
          parts = file.split('/')
          prog  = parts[0].split('.')[0]
          if (lang=='English') {
            if (parts[1]==='deutsch') { continue } else if (parts[1]==='english') { i = 1 } else { i = 0 }
          } else if (lang=='Germany') {
            if (parts[1]==='english') { continue } else if (parts[1]==='deutsch') { i = 1 } else { i = 0 }
          }
          title = parts.slice(1+i).join('/')
          filesSorted.push({
            fileName: file,
            prog : prog,
            title: title,
            text : `#${prog} ${title}`,
          })
        }
        this.items = filesSorted
        this.selectListView.update({items:this.items})
      })
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

  didConfirmSelection() {
    let item = this.selectListView.getSelectedItem()
    if (item) { this.hide() } else { return }
    let filePath = path.join(this.sofPath, item.fileName)
    atom.workspace.open(filePath)
  }

}
