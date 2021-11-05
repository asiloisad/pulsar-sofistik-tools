'use babel'

import { Disposable, CompositeDisposable } from 'atom'
import HelpView from './help-view'
import VersionView from './version-view'
import TextView from './text-view';
import { exec } from 'child_process'
const { shell } = require('electron')
const path = require('path');
var fs = require("fs")
var glob = require('glob')
import { chdir, cwd } from 'process';

export default {
  config: {
    envPath: {
      type: 'string',
      title: "SOFiSTiK installation path",
      description: "Path to the folder with the SOFiSTiK installation",
      order: 1,
      default: 'C:\\Program Files\\SOFiSTiK'
    }, version: {
      type: 'string',
      title: "SOFiSTiK program version",
      order: 2,
      default: '2020',
      enum: ["2020", "2018"],
      description: "Select the software version for which the programs will be used. Make sure the software and the license are available on your computer"
    }, lang: {
      type: 'string',
      title: "Language of help documents",
      description: "This setting determines the language in which the .pdf file with help will be displayed",
      default: 'English',
      enum: ['English', 'Germany'],
      order: 3,
    }
  },

  activate (_state) {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar="source sofistik"]', {
      'SOFiSTiK-tools:calculation-WPS':
        () => this.runCalc('wps'),
      'SOFiSTiK-tools:calculation-WPS-immediately':
        () => this.runCalc('wps', '-run -e'),
      'SOFiSTiK-tools:calculation-WPS-immediately-current-prog':
        () => this.runCalcCurrentNow('wps'),
      'SOFiSTiK-tools:calculation-SPS-immediately':
        () => this.runCalc('sps'),
      'SOFiSTiK-tools:calculation-WPS-2020':
        () => this.runCalc('wps', '', '2020'),
      'SOFiSTiK-tools:calculation-WPS-2018':
        () => this.runCalc('wps', '', '2018'),

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

      'SOFiSTiK-tools:open-or-create-file-SOFiPLUS':
        () => this.openSofiPlus(0),
      'SOFiSTiK-tools:open-file-SOFiPLUS':
        () => this.openSofiPlus(1),
      'SOFiSTiK-tools:create-file-SOFiPLUS':
        () => this.openSofiPlus(2),

      'SOFiSTiK-tools:export-CDB-to-DAT':
        () => this.exportCDB2DAT(),
      'SOFiSTiK-tools:export-PLB-to-DOCX':
        () => this.exportPLB2DOCX(),

      'SOFiSTiK-tools:PROG-current-toggle': () => this.changeProg(),
      'SOFiSTiK-tools:PROG-all-toggle'    : () => this.changeProgs('all'),
      'SOFiSTiK-tools:PROG-all-ON'        : () => this.changeProgs('all', 'ON'),
      'SOFiSTiK-tools:PROG-all-OFF'       : () => this.changeProgs('all', 'OFF'),
      'SOFiSTiK-tools:PROG-above-toggle'  : () => this.changeProgs('above'),
      'SOFiSTiK-tools:PROG-above-ON'      : () => this.changeProgs('above', 'ON'),
      'SOFiSTiK-tools:PROG-above-OFF'     : () => this.changeProgs('above', 'OFF'),
      'SOFiSTiK-tools:PROG-below-toggle'  : () => this.changeProgs('below'),
      'SOFiSTiK-tools:PROG-below-ON'      : () => this.changeProgs('below', 'ON'),
      'SOFiSTiK-tools:PROG-below-OFF'     : () => this.changeProgs('below', 'OFF'),

    }))

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'SOFiSTiK-tools:open-help':
        () => this.openHelpPDF(),
      'SOFiSTiK-tools:IFC-export':
        () => this.ifcExport(),
      'SOFiSTiK-tools:IFC-import':
        () => this.ifcImport(),
      'SOFiSTiK-tools:change-version':
        () => this.changeVersion(),
      'SOFiSTiK-tools:open-CDBASE.CHM':
        () => this.openCDBchm(),
    }))

    this.subscriptions.add(atom.commands.add('.tree-view', {
      'SOFiSTiK-tools:clean-by-glob-pattern':
        () => this.cleanCustomFilters(),
      'SOFiSTiK-tools:clean-[S]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB]':
        () => this.cleanSelectedFolders(11),
      'SOFiSTiK-tools:clean-[R]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB]':
        () => this.cleanSelectedFolders(21),
      'SOFiSTiK-tools:clean-[S]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB-CDI-CDE]':
        () => this.cleanSelectedFolders(12),
      'SOFiSTiK-tools:clean-[R]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB-CDI-CDE]':
        () => this.cleanSelectedFolders(22),
      'SOFiSTiK-tools:clean-[S]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB-CDI-CDE-CDB]':
        () => this.cleanSelectedFolders(13),
      'SOFiSTiK-tools:clean-[R]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB-CDI-CDE-CDB]':
        () => this.cleanSelectedFolders(23),
    }))

    this.helpView = new HelpView();
    this.helpView.getSofPath = this.getSofPath
    this.versionView = new VersionView();
  },

  getSofPath(version) {
    envPath = atom.config.get('sofistik-tools.envPath')

    if (!version) {version = atom.config.get('sofistik-tools.version')}

    if (version==='2020') {
      sofPath = path.join(envPath, '2020','SOFiSTiK 2020')
    } else if (version==='2018') {
      sofPath = path.join(envPath, '2018','SOFiSTiK 2018')
    } else {
      atom.notifications.addError(`SOFiSTiK version ${version} is not supported`)
      return
    }

   if (!fs.existsSync(sofPath)) {
      atom.notifications.addError(`SOFiSTiK environment "${envPath}" is not available`)
    }

    return sofPath
  },

  runCalc(parser, parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.buffer.file.path
    editor.save()
    exec(`"${this.getSofPath(version)}\\${parser}.exe" "${pathSrc}" ${parameters}`)
  },

  runCalcCurrentNow(parser, version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.buffer.file.path
    editor.save()

    range = [[0,0], editor.getCursorBufferPosition()]
    let line
    editor.backwardsScanInBufferRange(/(?:prog|sys) /ig, range, (object) => {
      console.log(object)
      line = object.range.start.row
      object.stop()
    })
    if (!line) {return}
    exec(`"${this.getSofPath(version)}\\${parser}.exe" "${pathSrc}" -run:${line+1} -e`)
  },

  openReport(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.buffer.file.path
    pathSrc = pathSrc.replace('.dat', '.plb');
    exec(`"${this.getSofPath(version)}\\ursula.exe" ${parameters} "${pathSrc}"`)
  },

  openProtocol() {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.buffer.file.path
    pathSrc = pathSrc.replace('.dat', '.prt');
    atom.workspace.open(pathSrc)
  },

  openAnimator(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.buffer.file.path
    pathSrc = pathSrc.replace('.dat', '.cdb');
    exec(`"${this.getSofPath(version)}\\animator.exe" ${parameters} "${pathSrc}"`)
  },

  openSSD(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.buffer.file.path
    pathSrc = pathSrc.replace('.dat', '.sofistik');
    exec(`"${this.getSofPath(version)}\\ssd.exe" ${parameters} "${pathSrc}"`)
  },

  openWinGRAF(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.buffer.file.path
    pathSrc = pathSrc.replace('.dat', '.gra');
    exec(`"${this.getSofPath(version)}\\wingraf.exe" ${parameters} "${pathSrc}"`)
  },

  openResultViewer(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.buffer.file.path
    pathSrc = pathSrc.replace('.dat', '.results');
    exec(`"${this.getSofPath(version)}\\resultviewer.exe" ${parameters} "${pathSrc}"`)
  },

  openTeddy(parameters='', version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.buffer.file.path
    exec(`"${this.getSofPath(version)}\\ted.exe" ${parameters} "${pathSrc}" ${(editor.getCursorBufferPosition().row+1)}`)
  },

  openHelpPDF() {
    this.helpView.show()
  },

  openSofiPlus(mode=0, version) {
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.buffer.file.path
    pathSrc = pathSrc.replace('.dat', '.dwg');

    if (mode===0) {
      if (!fs.existsSync(pathSrc)) {
        atom.notifications.addInfo(`File ${pathSrc} does not exists, new .dwg created`)
      }
      exec(`"${this.getSofPath(version)}\\sofiplus_launcher.exe" "${pathSrc}"`)
    } else if (mode===1) {
      if (!fs.existsSync(pathSrc)) {
        atom.notifications.addError(`File ${pathSrc} does not exists`)
      } else {
        exec(`"${this.getSofPath(version)}\\sofiplus_launcher.exe" "${pathSrc}"`)
      }
    } else if (mode===2) {
      if (!fs.existsSync(pathSrc)) {
        exec(`"${this.getSofPath(version)}\\sofiplus_launcher.exe" "${pathSrc}"`)
      } else {
        atom.notifications.addError(`File ${pathSrc} already exists`)
      }
    }
  },

  exportCDB2DAT(version){
    const editor = atom.workspace.getActivePaneItem()
    pathSrc = editor.buffer.file.path
    pathSrc = pathSrc.replace('.dat', '.cdb');
    exec(`"${this.getSofPath(version)}\\export.exe" "${pathSrc}"`)
  },

  ifcExport(version){
    exec(`"${this.getSofPath(version)}\\ifcexport_gui.exe"`)
  },

  ifcImport(version){
    exec(`"${this.getSofPath(version)}\\ifcimport_gui.exe"`)
  },

  changeVersion(){
    this.versionView.open()
  },

  exportPLB2DOCX(){
    const editor = atom.workspace.getActivePaneItem()
    path0 = editor.buffer.file.path
    pathSrc = path0.replace('.dat', '.plb');
    pathDst = path0.replace('.dat', '.docx');
    exec(`"${this.getSofPath("2020")}\\plbdocx.exe" -f "${pathSrc}" -o "${pathDst}"`)
  },

  openCDBchm(version) {
    shell.openPath(`${this.getSofPath(version)}\\cdbase.chm`)
  },

  changeProg() {
    const editor = atom.workspace.getActiveTextEditor()
    range = [[0,0], editor.getCursorBufferPosition()]

    editor.backwardsScanInBufferRange(/[-\+](?:prog|sys) /i, range,
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
      editor.scanInBufferRange(/[-\+](?:prog|sys) /ig, range,
        (object)=>object.replace(
          (object.matchText.charAt(0)=='-'?'+':'-')+object.matchText.substr(1)))
    } else if (mode==='ON') {
      editor.scanInBufferRange(/-(?:prog|sys) /ig, range,
        (object)=>object.replace("+"+object.matchText.substr(1)))
    } else if (mode==='OFF') {
      editor.scanInBufferRange(/\+(?:prog|sys) /ig, range,
        (object)=>object.replace("-"+object.matchText.substr(1)))
    }
  },

  cleanByPaths(dirPaths, filter) {
    if        (filter===11) {
      filter =    "*@(.erg|.prt|.lst|.urs|.sdb|.pl|.$??|.#??|.grb)"
    } else if (filter===21) {
      filter = "**/*@(.erg|.prt|.lst|.urs|.sdb|.pl|.$??|.#??|.grb)"

    } else if (filter===12) {
      filter =    "*@(.erg|.prt|.lst|.urs|.sdb|.pl|.$??|.#??|.grb|.cdi|.cde)"
    } else if (filter===22) {
      filter = "**/*@(.erg|.prt|.lst|.urs|.sdb|.pl|.$??|.#??|.grb|.cdi|.cde)"

    } else if (filter===13) {
      filter =    "*@(.erg|.prt|.lst|.urs|.sdb|.pl|.$??|.#??|.grb|.cdi|.cde|.cdb)"
    } else if (filter===23) {
      filter = "**/*@(.erg|.prt|.lst|.urs|.sdb|.pl|.$??|.#??|.grb|.cdi|.cde|.cdb)"
    }

    for (let dirPath of dirPaths) {
      if (!fs.statSync(dirPath).isDirectory()) {continue}
      glob(filter, {cwd:dirPath, nosort:true, silent:true, nodir:true}, (er, files) => {
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
  }

};
