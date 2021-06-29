/** @babel */

import SelectListView from 'atom-select-list'
import fuzzaldrin from 'fuzzaldrin'
import fuzzaldrinPlus from 'fuzzaldrin-plus'
var fs = require("fs")

// https://www.electronjs.org/docs/api/shell
const { shell } = require('electron')

export default class HelpView {

  constructor () {
    this.selectListView = new SelectListView({
      initiallyVisibleItemCount: 10,
      items: [],
      filter: this.filter,
      emptyMessage: 'No matches found',
      elementForItem: (item, {index, selected, visible}) => {
        if (!visible) {
          return document.createElement("li")
        }

        const li = document.createElement('li')
        li.classList.add('event', 'two-lines')
        li.dataset.eventName = item.name

        const rightBlock = document.createElement('div')
        rightBlock.classList.add('pull-right')

        const leftBlock = document.createElement('div')
        const titleEl = document.createElement('div')
        titleEl.classList.add('primary-line')
        titleEl.title = item.name
        leftBlock.appendChild(titleEl)

        const query = this.selectListView.getQuery()
        this.highlightMatchesInElement(item.displayName, query, titleEl)

        if (selected) {
          let secondaryEl = document.createElement('div')
          secondaryEl.classList.add('secondary-line')
          secondaryEl.style.display = 'flex'

          if (typeof item.description === 'string') {
            secondaryEl.appendChild(this.createDescription(item.description, query))
          }

          if (Array.isArray(item.tags)) {
            const matchingTags = item.tags
              .map(t => [t, this.fuzz.score(t, query)])
              .filter(([t, s]) => s > 0)
              .sort((a, b) => a.s - b.s)
              .map(([t, s]) => t)

            if (matchingTags.length > 0) {
              secondaryEl.appendChild(this.createTags(matchingTags, query))
            }
          }

          leftBlock.appendChild(secondaryEl)
        }

        li.appendChild(leftBlock)
        return li
      },

      didConfirmSelection: (keyBinding) => {
        this.hide()
        path1 = path.join(this.path11, keyBinding.displayName+this.postLang+'.pdf')
        if (this.modes[0]===1) {
          atom.workspace.open(path1)
        } else if (this.modes[0]===2) {
          shell.openPath(path1)
        }
      },

      didCancelSelection: () => {
        this.hide()
      }

    })

    this.modes = [1]

    atom.commands.add(this.selectListView.element, {
      'sofistik-help:alt-select': (event) => {
        this.modes[0] = 2
        this.selectListView.confirmSelection();
        this.modes[0] = 1
        event.stopPropagation();
      }
    })

    this.selectListView.element.classList.add('sofistik-help')
  }

  async destroy () {
    await this.selectListView.destroy()
  }

  toggle () {
    if (this.panel && this.panel.isVisible()) {
      this.hide()
      return Promise.resolve()
    } else {
      return this.show()
    }
  }

  async show () {
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({item: this.selectListView})
    }

    if (!this.preserveLastSearch) {
      this.selectListView.reset()
    } else {
      this.selectListView.refs.queryEditor.selectAll()
    }

    this.activeElement = (document.activeElement === document.body) ? atom.views.getView(atom.workspace) : document.activeElement

    lang = atom.config.get('sofistik-tools.lang')
    if (lang=='English') {
      this.postLang = '_1'
    } else if (lang=='Germany') {
      this.postLang = '_0'
    }

    this.path11 = this.getSofPath()
    var files = fs.readdirSync(this.path11);

    filesSorted = []

    for (let filename of files) {

      if (filename.slice(-6, )==this.postLang+'.pdf'){
        filesSorted.push({
          displayName: filename.slice(0, -6).toUpperCase()
        })
      }
    }

    await this.selectListView.update({items: filesSorted})

    this.previouslyFocusedElement = document.activeElement
    this.panel.show()
    this.selectListView.focus()
  }

  hide () {
    this.panel.hide()
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }

  async update (props) {
    if (props.hasOwnProperty('preserveLastSearch')) {
      this.preserveLastSearch = props.preserveLastSearch
    }

    if (props.hasOwnProperty('useAlternateScoring')) {
      this.useAlternateScoring = props.useAlternateScoring
    }
  }

  get fuzz () {
    return this.useAlternateScoring ? fuzzaldrinPlus : fuzzaldrin
  }

  highlightMatchesInElement (text, query, el) {
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

  filter = (items, query) => {
    if (query.length === 0) {
      return items
    }

    const scoredItems = []
    for (const item of items) {
      let score = this.fuzz.score(item.displayName, query)
      if (item.tags) {
        score += item.tags.reduce(
          (currentScore, tag) => currentScore + this.fuzz.score(tag, query),
          0
        )
      }
      if (item.description) {
        score += this.fuzz.score(item.description, query)
      }

      if (score > 0) {
        scoredItems.push({item, score})
      }
    }
    scoredItems.sort((a, b) => b.score - a.score)
    return scoredItems.map((i) => i.item)
  }


  createDescription (description, query) {
    const descriptionEl = document.createElement('div')

    // in case of overflow, give full contents on long hover
    descriptionEl.title = description

    Object.assign(descriptionEl.style, {
      flexGrow: 1,
      flexShrink: 1,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    })
    this.highlightMatchesInElement(description, query, descriptionEl)
    return descriptionEl
  }

  createTag (tagText, query) {
    const tagEl = document.createElement('li')
    Object.assign(tagEl.style, {
      borderBottom: 0,
      display: 'inline',
      padding: 0
    })
    this.highlightMatchesInElement(tagText, query, tagEl)
    return tagEl
  }

  createTags (matchingTags, query) {
    const tagsEl = document.createElement('ol')
    Object.assign(tagsEl.style, {
      display: 'inline',
      marginLeft: '4px',
      flexShrink: 0,
      padding: 0
    })

    const introEl = document.createElement('strong')
    introEl.textContent = 'matching tags: '

    tagsEl.appendChild(introEl)
    matchingTags.map(t => this.createTag(t, query)).forEach((tagEl, i) => {
      tagsEl.appendChild(tagEl)
      if (i < matchingTags.length - 1) {
        const commaSpace = document.createElement('span')
        commaSpace.textContent = ', '
        tagsEl.appendChild(commaSpace)
      }
    })
    return tagsEl
  }
}
