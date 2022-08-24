'use babel'

import { Disposable, CompositeDisposable, Point } from 'atom'
import { exec }     from 'child_process'
import HelpListView from './help-list-view'
import VersListView from './vers-list-view'
import TextView     from './text-view'
import keywords     from './keywords'
const { shell } = require('electron')
const path      = require('path')
const fs        = require("fs")
const glob      = require('glob')

export default {

  config: {
    envPath: {
      order: 1,
      title: "SOFiSTiK installation path",
      description: "Path to the folder with the SOFiSTiK installation",
      type: 'string',
      default: 'C:\\Program Files\\SOFiSTiK'
    },
    version: {
      order: 2,
      title: "SOFiSTiK program version",
      description: "Select the software version for which the programs will be used. Make sure the software and the license are available on your computer",
      type: 'string',
      enum: ["2022", "2020", "2018"],
      default: '2022',
    },
    lang: {
      order: 3,
      title: "Language of help documents",
      description: "This setting determines the language in which the `.pdf` file with help will be displayed",
      type: 'string',
      enum: ['English', 'Germany'],
      default: 'English',
    },
  },

  activate (_state) {
    this.helpListView = new HelpListView(this)
    this.versListView = new VersListView();
    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.commands.add('atom-text-editor[data-grammar="source sofistik"]', {
        'SOFiSTiK-tools:current-help':
          () => this.currentHelp(1),
        'SOFiSTiK-tools:current-help-free':
          () => this.currentHelp(2),
        'SOFiSTiK-tools:current-help-externally':
          () => this.currentHelp(3),
        'SOFiSTiK-tools:calculation-WPS':
          () => this.runCalc('wps'),
        'SOFiSTiK-tools:calculation-WPS-immediately':
          () => this.runCalc('wps', '-run -e'),
        'SOFiSTiK-tools:calculation-WPS-immediately-current-prog':
          () => this.runCalcCurrentNow('wps'),
        'SOFiSTiK-tools:calculation-SPS-immediately':
          () => this.runCalc('sps'),
        'SOFiSTiK-tools:open-report':
          () => this.openReport(),
        'SOFiSTiK-tools:open-report-automatic-refresh':
          () => this.openReport('-r'),
        'SOFiSTiK-tools:save-report-as-PDF':
          () => this.openReport('-t -printto:PDF'),
        'SOFiSTiK-tools:save-pictures-as-PDF':
          () => this.openReport('-g -picture:all -printto:PDF'),
        'SOFiSTiK-tools:open-protocol':
          () => this.openProtocol(),
        'SOFiSTiK-tools:open-Animator':
          () => this.openAnimator(),
        'SOFiSTiK-tools:open-Animator-2018':
          () => this.openAnimator('', '2018'),
        'SOFiSTiK-tools:open-SSD':
          () => this.openSSD(),
        'SOFiSTiK-tools:open-WinGRAF':
          () => this.openWinGRAF(),
        'SOFiSTiK-tools:open-Result-Viewer':
          () => this.openResultViewer(),
        'SOFiSTiK-tools:open-Teddy':
          () => this.openTeddy('-0'),
        'SOFiSTiK-tools:open-Teddy-1':
          () => this.openTeddy('-1'),
        'SOFiSTiK-tools:open-Teddy-2':
          () => this.openTeddy('-2'),
        'SOFiSTiK-tools:open-Teddy-3':
          () => this.openTeddy('-3'),
        'SOFiSTiK-tools:open-Teddy-4':
          () => this.openTeddy('-4'),
        'SOFiSTiK-tools:open-SOFiPLUS':
          () => this.openSofiPlus(),
        'SOFiSTiK-tools:export-CDB-to-DAT':
          () => this.exportCDB2DAT(),
        'SOFiSTiK-tools:export-PLB-to-DOCX':
          () => this.exportPLB2DOCX(),
        'SOFiSTiK-tools:PROG-current-toggle':
          () => this.changeProg(),
        'SOFiSTiK-tools:PROG-all-toggle':
          () => this.changeProgs('all'),
        'SOFiSTiK-tools:PROG-all-ON':
          () => this.changeProgs('all', 'ON'),
        'SOFiSTiK-tools:PROG-all-OFF':
          () => this.changeProgs('all', 'OFF'),
        'SOFiSTiK-tools:PROG-above-toggle':
          () => this.changeProgs('above'),
        'SOFiSTiK-tools:PROG-above-ON':
          () => this.changeProgs('above', 'ON'),
        'SOFiSTiK-tools:PROG-above-OFF':
          () => this.changeProgs('above', 'OFF'),
        'SOFiSTiK-tools:PROG-below-toggle':
          () => this.changeProgs('below'),
        'SOFiSTiK-tools:PROG-below-ON':
          () => this.changeProgs('below', 'ON'),
        'SOFiSTiK-tools:PROG-below-OFF':
          () => this.changeProgs('below', 'OFF'),
      }),
      atom.commands.add('atom-workspace', {
        'SOFiSTiK-tools:IFC-export':
          () => this.ifcExport(),
        'SOFiSTiK-tools:IFC-import':
          () => this.ifcImport(),
        'SOFiSTiK-tools:open-CDBASE.CHM':
          () => this.openCDBchm(),
      }),
      atom.commands.add('.tree-view', {
        'SOFiSTiK-tools:clean-by-glob-pattern':
          () => this.cleanCustomFilters(),
        'SOFiSTiK-tools:clean-[S]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB]':
          () => this.cleanSelectedFolders(11),
        'SOFiSTiK-tools:clean-[R]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB]':
          () => this.cleanSelectedFolders(21),
        'SOFiSTiK-tools:clean-[S]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE]':
          () => this.cleanSelectedFolders(12),
        'SOFiSTiK-tools:clean-[R]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE]':
          () => this.cleanSelectedFolders(22),
        'SOFiSTiK-tools:clean-[S]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE-CDB]':
          () => this.cleanSelectedFolders(13),
        'SOFiSTiK-tools:clean-[R]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE-CDB]':
          () => this.cleanSelectedFolders(23),
        'SOFiSTiK-tools:clean-[S]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE-CDB-PLB-BAK-SDB-DOCX-CFG]':
          () => this.cleanSelectedFolders(14),
        'SOFiSTiK-tools:clean-[R]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE-CDB-PLB-BAK-SDB-DOCX-CFG]':
          () => this.cleanSelectedFolders(24),
      })
    )
    this.viewerMode = true
    this.viewer = null
  },

  deactivate () {
    this.disposables .dispose()
    this.helpListView.destroy()
    this.versListView.destroy()
  },

  getSofPath(version) {
    envPath = atom.config.get('sofistik-tools.envPath')
    if (!version) {
      editor = atom.workspace.getActiveTextEditor()
      if (editor) {
        editor.backwardsScanInBufferRange(/^@ SOFiSTiK (\d{4})(-\d\d?)?$/, [Point.ZERO, editor.getCursorBufferPosition()],
          (item) => {
            version = item.match[1] ; item.stop()
          }
        )
      }
    }
    if (!version) {version = atom.config.get('sofistik-tools.version')}
    sofPath = path.join(envPath, version, 'SOFiSTiK '+version)
    if (!fs.existsSync(sofPath)) {
      atom.notifications.addError(`SOFiSTiK environment "${envPath}" version "${version}" is not available`)
    }
    return sofPath
  },

  runCalc(parser, parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.getPath() ; if (!pathSrc) {return}
    editor.save()
    exec(`"${this.getSofPath(version)}\\${parser}.exe" "${pathSrc}" ${parameters}`)
    editor.scan(/^@ child:(.+)$/gm, (item) => {
      pathSrcRun = path.join(path.dirname(pathSrc), item.match[1].trim())
      exec(`"${this.getSofPath(version)}\\${parser}.exe" "${pathSrcRun}" ${parameters}`)
    })
  },

  runCalcCurrentNow(parser, version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.getPath() ; if (!pathSrc) {return}
    editor.save()
    range = [[0,0], editor.getCursorBufferPosition()]
    let line
    editor.backwardsScanInBufferRange(/(?:prog|sys|apply|chapter) /ig, range, (object) => {
      console.log(object)
      line = object.range.start.row
      object.stop()
    })
    if (!line) {return}
    exec(`"${this.getSofPath(version)}\\${parser}.exe" "${pathSrc}" -run:${line+1} -e`)
  },

  openReport(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.getPath() ; if (!pathSrc) {return}
    pathSrc = pathSrc.replace('.dat', '.plb');
    exec(`"${this.getSofPath(version)}\\ursula.exe" ${parameters} "${pathSrc}"`)
  },

  openProtocol() {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.getPath() ; if (!pathSrc) {return}
    pathSrc = pathSrc.replace('.dat', '.prt');
    atom.workspace.open(pathSrc)
  },

  openAnimator(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.getPath() ; if (!pathSrc) {return}
    pathSrc = pathSrc.replace('.dat', '.cdb');
    exec(`"${this.getSofPath(version)}\\animator.exe" ${parameters} "${pathSrc}"`)
  },

  openSSD(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.getPath() ; if (!pathSrc) {return}
    pathSrc = pathSrc.replace('.dat', '.sofistik');
    exec(`"${this.getSofPath(version)}\\ssd.exe" ${parameters} "${pathSrc}"`)
  },

  openWinGRAF(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.getPath() ; if (!pathSrc) {return}
    pathSrc = pathSrc.replace('.dat', '.gra');
    exec(`"${this.getSofPath(version)}\\wingraf.exe" ${parameters} "${pathSrc}"`)
  },

  openResultViewer(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.getPath() ; if (!pathSrc) {return}
    pathSrc = pathSrc.replace('.dat', '.results');
    exec(`"${this.getSofPath(version)}\\resultviewer.exe" ${parameters} "${pathSrc}"`)
  },

  openTeddy(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.getPath() ; if (!pathSrc) {return}
    exec(`"${this.getSofPath(version)}\\ted.exe" ${parameters} "${pathSrc}" ${(editor.getCursorBufferPosition().row+1)}`)
  },

  openSofiPlus(version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.getPath() ; if (!pathSrc) {return}
    pathSrc = pathSrc.replace('.dat', '.dwg');
    exec(`"${this.getSofPath(version)}\\sofiplus_launcher.exe" "${pathSrc}"`)
  },

  exportCDB2DAT(version){
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.getPath() ; if (!pathSrc) {return}
    pathSrc = pathSrc.replace('.dat', '.cdb');
    exec(`"${this.getSofPath(version)}\\export.exe" "${pathSrc}"`)
  },

  ifcExport(version){
    exec(`"${this.getSofPath(version)}\\ifcexport_gui.exe"`)
  },

  ifcImport(version){
    exec(`"${this.getSofPath(version)}\\ifcimport_gui.exe"`)
  },

  exportPLB2DOCX(version){
    const editor = atom.workspace.getActivePaneItem()
    path0 = editor.getPath()
    pathSrc = path0.replace('.dat', '.plb');
    pathDst = path0.replace('.dat', '.docx');
    exec(`"${this.getSofPath(version)}\\plbdocx.exe" -f "${pathSrc}" -o "${pathDst}"`)
  },

  openCDBchm(version) {
    shell.openPath(`${this.getSofPath(version)}\\cdbase.chm`)
  },

  changeProg() {
    const editor = atom.workspace.getActiveTextEditor()
    range = [[0,0], editor.getCursorBufferPosition()]
    editor.backwardsScanInBufferRange(/[-\+](?:prog|sys|apply) /i, range,
      (object)=>object.replace(
        (object.matchText.charAt(0)=='-'?'+':'-')+object.matchText.substr(1)
      )
    )
  },

  changeProgs(range, mode) {
    const editor = atom.workspace.getActiveTextEditor()
    if (range==='above') {
      range = [[0,0], editor.getCursorBufferPosition()]
    } else if (range==='below') {
      range = [editor.getCursorBufferPosition(),
        [editor.getLineCount(), 1e10]
      ]
    } else if (range==='all') {
      range = [[0,0], [editor.getLineCount(), 1e10]]
    }
    if (!mode) {
      editor.scanInBufferRange(/[-\+](?:prog|sys|apply) /ig, range,
        (object)=>object.replace(
          (object.matchText.charAt(0)=='-'?'+':'-')+object.matchText.substr(1)))
    } else if (mode==='ON') {
      editor.scanInBufferRange(/-(?:prog|sys|apply) /ig, range,
        (object)=>object.replace("+"+object.matchText.substr(1)))
    } else if (mode==='OFF') {
      editor.scanInBufferRange(/\+(?:prog|sys|apply) /ig, range,
        (object)=>object.replace("-"+object.matchText.substr(1)))
    }
  },

  parseFilter(filter) {
    if        (filter===11) {
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$??|.#??|.grb)"
    } else if (filter===21) {
      return '**/'+this.parseFilter(11)
    } else if (filter===12) {
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$??|.#??|.grb|.cdi|.cde)"
    } else if (filter===22) {
      return '**/'+this.parseFilter(12)
    } else if (filter===13) {
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$??|.#??|.grb|.cdi|.cde|.cdb)"
    } else if (filter===23) {
      return '**/'+this.parseFilter(13)
    } else if (filter===14) {
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$??|.#??|.grb|.cdi|.cde|.cdb|.plb|.bak|.sdb|.docx|.cfg|_csm.dat|_csmlf.dat)"
    } else if (filter===24) {
      return '**/'+this.parseFilter(14)
    } else { return filter }
  },

  cleanByPaths(dirPaths, filter) {
    filter = this.parseFilter(filter)
    for (let dirPath of dirPaths) {
      if (!fs.statSync(dirPath).isDirectory()) {continue}
      glob(filter, {cwd:dirPath, nosort:true, silent:true, nodir:true}, (err, files) => {
        for (let file of files) {
          file = path.join(dirPath, file)
          try {
            fs.unlinkSync(file)
            console.log('DELETE:', `"${file}"`)
          } catch(err) {
            console.error('ERROR', err)
          }
        }
      })
    }
  },

  consumeTreeView(treeView) {
    this.treeView = treeView
    return new Disposable(() => {this.treeView = null});
  },

  cleanSelectedFolders(filter) {
    this.cleanByPaths(this.treeView.selectedPaths(), filter)
  },

  cleanCustomFilters() {
    ltv = new TextView('', false, false, 'Enter the glob pattern to find the files to be deleted')
    ltv.attach((filter)=>{ this.cleanSelectedFolders(filter) })
  },

  currentHelp(mode, version) {
    editor = atom.workspace.getActiveTextEditor()
    range = [Point.ZERO, editor.getLastCursor().getCurrentWordBufferRange().end]
    editor.backwardsScanInBufferRange(/[\+\-\$]?prog +(\w+)/i, range, (object)=>{
      prog = pro2 = object.match[1].toUpperCase()
      if (pro2.match(/wing/i)) {pro2='wingraf'}
      lang = atom.config.get('sofistik-tools.lang')
      if (lang=='English') {
        postLang = '_1'
      } else if (lang=='Germany') {
        postLang = '_0'
      }
      sofPath = this.getSofPath(version)
      if (fs.existsSync(filePath = path.join(sofPath, `${pro2}${postLang}.pdf`))) {
        flag = true
      } else if  (fs.existsSync(filePath = path.join(sofPath, `${pro2}.pdf`))) {
        flag = true
      } else {
        flag = false
      }
      if (flag) {
        if (mode===1) {
          this.singleViewer(object, range, filePath, prog)
        } else if (mode===2) {
          this.multiViewer(object, range, filePath, prog)
        } else if (mode===3) {
          this.externalViewer(object, range, filePath, prog)
        }
      } else {
        atom.notifications.addWarning(`Cannot find the manual for program "${prog}"`)
      }
      object.stop()
    })
  },

  singleViewer(object, range, filePath, prog) {
    this.findQ = false
    if (!atom.packages.isPackageActive('pdf-viewer')) {
      atom.workspace.open(filePath, {split:"right", activatePane:false})
      return
    } else {
      regex = new RegExp('(?:^[ \\t]*|; *)('+keywords[prog].join('|')+')\\b', 'i')
      nange = [object.range.start, range[1]]
      if (!this.viewer) {
        for (let item of atom.workspace.getPaneItems()) {
          if ('pdfjsPath' in item && item.hash.endsWith('&SOFiSTiK')) {
            this.viewer = item ; break
          }
        }
      }
      if (this.viewer) {
        atom.workspace.open(this.viewer.getURI(), {searchAllPanes:true, activatePane:false})
      }
      editor.backwardsScanInBufferRange(regex, nange, (finder)=>{
        if (this.viewer) {
          if (this.viewer.getPath()===filePath) {
            this.viewer.hash = `#nameddest=${finder.match[1].toUpperCase()}&SOFiSTiK`
            this.viewer.scrollToDestination( finder.match[1].toUpperCase() )
          } else {
            this.viewer.setFile(filePath, `#nameddest=${finder.match[1].toUpperCase()}&SOFiSTiK`)
            this.viewer.updateTitle()
            this.viewer.reload()
          }
        } else {
          atom.workspace.open(`${filePath}#nameddest=${finder.match[1].toUpperCase()}&SOFiSTiK`, {split:"right", activatePane:false}).then( (resolve, _) => {
            this.viewer = resolve
            this.viewer.onDidDispose(() => {this.viewer = null})
          })
        }
        this.findQ = true
        finder.stop()
      })
    }
    if (!this.findQ) {
      if (this.viewer) {
        if (this.viewer.getPath()!==filePath) {
          this.viewer.setFile(filePath, '&SOFiSTiK')
          this.viewer.updateTitle()
          this.viewer.reload()
        }
      } else {
        atom.workspace.open(`${filePath}&SOFiSTiK`, {split:"right", activatePane:false}).then( (resolve, _) => {
          this.viewer = resolve
          this.viewer.onDidDispose(() => {this.viewer = null})
        })
      }
    }
  },

  multiViewer(object, range, filePath, prog) {
    this.findQ = false
    if (atom.packages.isPackageActive('pdf-viewer')) {
      regex = new RegExp('(?:^[ \\t]*|; *)('+keywords[prog].join('|')+')\\b', 'i')
      nange = [object.range.start, range[1]]
      editor.backwardsScanInBufferRange(regex, nange, (finder)=>{
        atom.workspace.open(`${filePath}#nameddest=${finder.match[1].toUpperCase()}`, {split:"right", activatePane:false})
        this.findQ = true
        finder.stop()
      })
    }
    if (!this.findQ) {
      atom.workspace.open(filePath, {split:"right", activatePane:false})
    }
  },

  externalViewer(_, _, filePath, _) {
    shell.openPath(filePath)
  }

};
