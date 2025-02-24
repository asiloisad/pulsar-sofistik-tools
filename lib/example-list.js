/** @babel */
/** @jsx etch.dom */

const etch = require('etch')
const { CompositeDisposable } = require('atom')
const SelectListView = require('atom-select-list')
const { glob } = require('glob')
const path = require('path')

module.exports = class ExampleList {

  constructor (S) {
    this.S = S ; this.items = null

    this.slv = new SelectListView({
      items: [],
      maxResults: 50,
      emptyMessage: <div class='empty-message'>No matches found</div>,
      elementForItem: (item, {_, index, visible}) => {
        let li, query, matches, total, priBlock
        li = document.createElement('li')
        if (!visible) { return li }
        li.classList.add('event', 'two-lines')
        query = this.slv.getQuery()
        matches = query.length>0 ? atom.ui.fuzzyMatcher.match(item.text, query, { recordMatchIndexes:true }).matchIndexes : []
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
        li.addEventListener('contextmenu', () => { this.slv.selectIndex(index) })
        return li
      },
      didConfirmSelection: () => { this.didConfirmSelection() },
      didCancelSelection: () => { this.hide() },
      filter: (items, query) => {
        if (query.length===0) { return items }
        let scoredItems = []
        for (let item of items) {
          item.score = atom.ui.fuzzyMatcher.score(item.text, query)
          if (item.score<=0) { continue }
          scoredItems.push(item)
        }
        return scoredItems.sort((a,b) => b.score-a.score)
      },
    })
    this.slv.element.classList.add('command-palette')
    this.slv.element.classList.add('sofistik-tools')
    this.slv.element.classList.add('example-list')

    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.commands.add(this.slv.element, {
        'example-list:open': () => this.didConfirmSelection(),
      }),
      atom.config.observe('command-palette.preserveLastSearch', (value) => {
        this.preserveLastSearch = value
      }),
      atom.config.observe('sofistik-tools.showKeystrokes', (value) => {
        this.showKeystrokes = value
        this.slv.update({infoMessage:this.getInfoMessage()})
      }),
      atom.commands.add('atom-workspace', {
        'sofistik-tools:toggle-examples' : () => this.toggle(),
        'sofistik-tools:cache-examples': () => { this.items=null ; this.update() },
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
      let lang = atom.config.get('sofistik-tools.docLanguage')
      this.sofPath = this.S.getSofPath()
      let filesSorted = [] ; let parts ; let prog ; let title ; let i
      glob('*.dat/**/*.dat', { cwd:this.sofPath, nosort:true, silent:true, nodir:true }).then((files) => {
        for (let file of files) {
          parts = file.split(path.sep)
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
        this.slv.update({items:this.items})
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
    let item = this.slv.getSelectedItem()
    if (item) { this.hide() } else { return }
    let filePath = path.join(this.sofPath, item.fileName)
    atom.workspace.open(filePath)
  }

  getInfoMessage() {
    return this.showKeystrokes ? ['Press ', <span class='keystroke'>Enter</span>, ' or ', <span class='keystroke'>Alt-Enter</span>] : null
  }

}
