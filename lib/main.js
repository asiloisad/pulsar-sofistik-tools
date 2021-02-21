'use babel'

import { CompositeDisposable } from 'atom'
import HelpView from './help-view'
import VersionView from './version-view'
import { exec } from 'child_process'
const { shell } = require('electron')
const path = require('path');
var fs = require("fs")

export default {
  config: {
    envPath: {
      type: 'string',
      title: "SOFiSTiK environment path",
      order: 1,
      default: 'C:\\Program Files\\SOFiSTiK'
    }, version: {
      type: 'string',
      title: "SOFiSTiK version",
      order: 2,
      default: '2020'
    },lang: {
      type: 'string',
      title: "Language of SOFiSTiK environment",
      default: 'english',
      order: 3,
    }
  },

  activate (_state) {
    this.HelpView = new HelpView();
    this.HelpView.getSofPath = this.getSofPath
    this.VersionView = new VersionView();

    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar="source sofi"]', {
        'sofistik-tools:calculation-WPS':
          () => this.runCalc('wps'),
        'sofistik-tools:calculation-WPS-immediately':
          () => this.runCalc('wps', '-run -e'),
        'sofistik-tools:calculation-SPS-immediately':
          () => this.runCalc('sps'),
        'sofistik-tools:open-report':
          () => this.openReport(),
        'sofistik-tools:open-report-automatic-refresh':
          () => this.openReport('-r'),
        'sofistik-tools:save-report-as-PDF':
          () => this.openReport('-t -printto:PDF'),
        'sofistik-tools:save-pictures-as-PDF':
          () => this.openReport('-g -picture:all -printto:PDF'),
        'sofistik-tools:open-protocol':
          () => this.openProtocol(),
        'sofistik-tools:open-Animator':
          () => this.openAnimator(),
        'sofistik-tools:open-Animator-2018':
          () => this.openAnimator('', '2018'),
        'sofistik-tools:open-SSD':
          () => this.openSSD(),
        'sofistik-tools:open-WinGRAF':
          () => this.openWinGRAF(),
        'sofistik-tools:open-Result-Viewer':
          () => this.openResultViewer(),
        'sofistik-tools:open-Teddy':
          () => this.openTeddy('-0'),
        'sofistik-tools:open-Teddy-1':
          () => this.openTeddy('-1'),
        'sofistik-tools:open-Teddy-2':
          () => this.openTeddy('-2'),
        'sofistik-tools:open-Teddy-3':
          () => this.openTeddy('-3'),
        'sofistik-tools:open-Teddy-4':
          () => this.openTeddy('-4'),
        'sofistik-tools:open-or-create-file-SOFiPLUS':
          () => this.openSofiPlus(0),
        'sofistik-tools:open-file-SOFiPLUS':
          () => this.openSofiPlus(1),
        'sofistik-tools:create-file-SOFiPLUS':
          () => this.openSofiPlus(2),
        'sofistik-tools:calculation-WPS':
          () => this.runCalc('wps'),
        'sofistik-tools:calculation-WPS-2020':
          () => this.runCalc('wps', '', '2020'),
        'sofistik-tools:calculation-WPS-2018':
          () => this.runCalc('wps', '', '2018'),
        'sofistik-tools:export-CDB-to-DAT':
          () => this.exportCDB2DAT(),
        'sofistik-tools:export-PLB-to-DOCX':
          () => this.exportPLB2DOCX(),

        'sofistik-tools:PROG-current-toggle': () => this.changeCurrentProg(),
        'sofistik-tools:PROG-all-toggle'    : () => this.changeProg ('all'),
        'sofistik-tools:PROG-all-on'        : () => this.changeProg1('all'),
        'sofistik-tools:PROG-all-off'       : () => this.changeProg0('all'),
        'sofistik-tools:PROG-above-toggle'  : () => this.changeProg ('above'),
        'sofistik-tools:PROG-above-on'      : () => this.changeProg1('above'),
        'sofistik-tools:PROG-above-off'     : () => this.changeProg0('above'),
        'sofistik-tools:PROG-below-toggle'  : () => this.changeProg ('below'),
        'sofistik-tools:PROG-below-on'      : () => this.changeProg1('below'),
        'sofistik-tools:PROG-below-off'     : () => this.changeProg0('below'),

    }))

    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'sofistik-tools:open-help':
          () => this.openHelpPDF(),
        'sofistik-tools:open-help-externally':
          () => this.openHelpPDFExternal(),
        'sofistik-tools:IFC-export':
          () => this.ifcExport(),
        'sofistik-tools:IFC-import':
          () => this.ifcImport(),
        'sofistik-tools:change-version':
          () => this.changeVersion(),
        'sofistik-tools:open-CDBASE.CHM':
          () => this.openCDBchm(),
    }))
  },

  getSofPath(ver=null) {
    envPath = atom.config.get('sofistik-tools.envPath')

    if (ver==null) {ver = atom.config.get('sofistik-tools.version')}

    if (ver=='2020') {
      sofPaths = [
        path.join(atom.config.get('sofistik-tools.envPath'),
          '2020'),

        path.join(atom.config.get('sofistik-tools.envPath'),
          '2020','SOFiSTiK 2020'),

        path.join(atom.config.get('sofistik-tools.envPath'),
          '2020','SOFiPLUS 2020 (AutoCAD 2020)'),
      ]


    } else if (ver=='2018') {
      sofPaths = [
        path.join(atom.config.get('sofistik-tools.envPath'),
          '2018'),

        path.join(atom.config.get('sofistik-tools.envPath'),
          '2018','SOFiSTiK 2018'),

        path.join(atom.config.get('sofistik-tools.envPath'),
          '2018','SOFiPLUS 2018 (AutoCAD 2019)'),
      ]

    } else {
      atom.notifications.addError('Unsupported SOFiSTiK environment "'+envPath+'"')
      return
    }

   if (!fs.existsSync(sofPaths[0])) {
      atom.notifications.addError('SOFiSTiK version "'+sofPaths[0]+'" is not available')
    }

    return sofPaths
  },

  runCalc(parser, parameters='', ver=null) {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    editor.save()
    exec('"'+this.getSofPath(ver)[1] + '\\'+parser+'.exe" "'+path1+'" '+parameters)
  },

  openReport(parameters='', ver=null) {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    path1 = path1.replace('.dat', '.plb');
    exec('"'+this.getSofPath(ver)[1] + '\\ursula.exe" '+parameters+' "'+path1+'"')
  },

  openProtocol() {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    path1 = path1.replace('.dat', '.prt');
    atom.workspace.open(path1)
  },

  openAnimator(parameters='', ver=null) {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    path1 = path1.replace('.dat', '.cdb');
    exec('"'+this.getSofPath(ver)[1] + '\\animator.exe" '+parameters+' "'+path1+'"')
  },

  openSSD(parameters='', ver=null) {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    path1 = path1.replace('.dat', '.sofistik');
    exec('"'+this.getSofPath(ver)[1] + '\\ssd.exe" '+parameters+' "'+path1+'"')
  },

  openWinGRAF(parameters='', ver=null) {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    path1 = path1.replace('.dat', '.gra');
    exec('"'+this.getSofPath(ver)[1] + '\\wingraf.exe" '+parameters+' "'+path1+'"')
  },

  openResultViewer(parameters='', ver=null) {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    path1 = path1.replace('.dat', '.results');
    exec('"'+this.getSofPath(ver)[1] + '\\resultviewer.exe" '+parameters+' "'+path1+'"')
  },

  openTeddy(parameters='', ver=null) {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    exec('"'+this.getSofPath(ver)[1] + '\\ted.exe" '+parameters+' "'+path1+'" '+(editor.getCursorBufferPosition().row+1))
  },

  openHelpPDF() {
    this.HelpView.openMode = 0
    this.HelpView.show()
  },

  openHelpPDFExternal() {
    this.HelpView.openMode = 1
    this.HelpView.show();
  },

  /**
  @param {number} mode must be int
  * * 0: open file, but if not exists then create it
  * * 1: open file if exists, else error
  * * 2: create new file, if exists then error
  **/
  openSofiPlus(mode=0, ver=null) {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    path1 = path1.replace('.dat', '.dwg');

    if (mode==0) {
      if (!fs.existsSync(path1)) {
        atom.notifications.addInfo('File "'+path1+'" does not exists, new .dwg created')
      }
      exec('"'+this.getSofPath(ver)[1] + '\\sofiplus_launcher.exe" "'+path1+'"')
    } else if (mode==1) {
      if (!fs.existsSync(path1)) {
        atom.notifications.addError('File "'+path1+'" does not exists')
      } else {
        exec('"'+this.getSofPath(ver)[1] + '\\sofiplus_launcher.exe" "'+path1+'"')
      }
    } else if (mode==2) {
      if (!fs.existsSync(path1)) {
        exec('"'+this.getSofPath(ver)[1] + '\\sofiplus_launcher.exe" "'+path1+'"')
      } else {
        atom.notifications.addError('File "'+path1+'" already exists')
      }
    }
  },

  exportCDB2DAT(ver=null){
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    path1 = path1.replace('.dat', '.cdb');
    exec('"'+this.getSofPath(ver)[1] + '\\export.exe" "'+path1+'"')
  },

  ifcExport(ver=null){
    exec('"'+this.getSofPath(ver)[1] + '\\ifcexport_gui.exe"')
  },

  ifcImport(ver=null){
    exec('"'+this.getSofPath(ver)[1] + '\\ifcimport_gui.exe"')
  },

  changeVersion(){
    this.VersionView.open()
  },

  exportPLB2DOCX(){
    const editor = atom.workspace.getActivePaneItem()
    path0 = editor.buffer.file.path
    path1 = path0.replace('.dat', '.plb');
    path2 = path0.replace('.dat', '.docx');
    exec('"'+this.getSofPath("2020")[1] + '\\plbdocx.exe" -f "'+path1+'" -o "'+path2+'"')
  },

  openCDBchm(ver=null) {
    shell.openItem(this.getSofPath(ver)[1] + '\\cdbase.chm')
  },


  changeCurrentProg() {
    const editor = atom.workspace.getActiveTextEditor()
    range = [[0,0], editor.getCursorBufferPosition()]

    editor.backwardsScanInBufferRange(/[-\+]prog /i, range,
      (object)=>object.replace(
        (object.matchText.charAt(0)=='-'?'+':'-')+object.matchText.substr(1)
      )
    )
  },

  changeProg(range) {
    const editor = atom.workspace.getActiveTextEditor()

    if (range=='above') {
      range = [[0,0], editor.getCursorBufferPosition()]
    } else if (range=='below') {
      range = [editor.getCursorBufferPosition(),
        [editor.getLineCount(), 1e10]
      ]
    } else if (range=='all') {
      range = [[0,0], [editor.getLineCount(), 1e10]]
    }

    editor.scanInBufferRange(/[-\+]prog /ig, range,
      (object)=>object.replace(
        (object.matchText.charAt(0)=='-'?'+':'-')+object.matchText.substr(1)
      )
    )
  },


  changeProg0(range) {
    const editor = atom.workspace.getActiveTextEditor()

    if (range=='above') {
      range = [[0,0], editor.getCursorBufferPosition()]
    } else if (range=='below') {
      range = [editor.getCursorBufferPosition(),
        [editor.getLineCount(), 1e10]
      ]
    } else if (range=='all') {
      range = [[0,0], [editor.getLineCount(), 1e10]]
    }

    editor.scanInBufferRange(/\+prog /ig, range,
      (object)=>object.replace("-"+object.matchText.substr(1))
    )
  },


  changeProg1(range) {
    const editor = atom.workspace.getActiveTextEditor()

    if (range=='above') {
      range = [[0,0], editor.getCursorBufferPosition()]
    } else if (range=='below') {
      range = [editor.getCursorBufferPosition(),
        [editor.getLineCount(), 1e10]
      ]
    } else if (range=='all') {
      range = [[0,0], [editor.getLineCount(), 1e10]]
    }

    editor.scanInBufferRange(/-prog /ig, range,
      (object)=>object.replace("+"+object.matchText.substr(1))
    )
  },



};
