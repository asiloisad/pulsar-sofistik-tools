'use babel'

import { CompositeDisposable } from 'atom'

import { exec } from 'child_process'

// https://www.electronjs.org/docs/api/shell
const { shell } = require('electron')

const path = require('path');

var fs = require("fs")

let subscriptions

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
      order: 1,
      default: '2020'
    }
  },

  activate (_state) {
    subscriptions = new CompositeDisposable()
    subscriptions.add(atom.commands.add('atom-text-editor[data-grammar="source sofi"]', {
        'SOFiSTiK-atom:calculation-WPS':
          () => this.runCalc('wps'),
        'SOFiSTiK-atom:calculation-WPS-immediately':
          () => this.runCalc('wps', '-run -e'),
        'SOFiSTiK-atom:calculation-SPS':
          () => this.runCalc('sps'),
        'SOFiSTiK-atom:open-report':
          () => this.openReport(),
        'SOFiSTiK-atom:open-report-automatic-refresh':
          () => this.openReport('-r'),
        'SOFiSTiK-atom:save-report-as-PDF':
          () => this.openReport('-t -printto:PDF'),
        'SOFiSTiK-atom:save-pictures-as-PDF':
          () => this.openReport('-g -picture:all -printto:PDF'),
        'SOFiSTiK-atom:open-Animator':
          () => this.openAnimator(),
        'SOFiSTiK-atom:open-SSD':
          () => this.openSSD(),
        'SOFiSTiK-atom:open-WinGRAF':
          () => this.openWinGRAF(),
        'SOFiSTiK-atom:open-Result-Viewer':
          () => this.openResultViewer(),
        'SOFiSTiK-atom:open-Teddy-1':
          () => this.openTeddy('-0'),
        'SOFiSTiK-atom:open-Teddy-2':
          () => this.openTeddy('-1'),
        'SOFiSTiK-atom:open-Teddy-3':
          () => this.openTeddy('-2'),
        'SOFiSTiK-atom:open-Teddy-4':
          () => this.openTeddy('-3'),
        'SOFiSTiK-atom:open-Teddy-5':
          () => this.openTeddy('-4'),
        'SOFiSTiK-atom:open-or-create-file-SOFiPLUS':
          () => this.openSofiPlus(0),
        'SOFiSTiK-atom:open-file-SOFiPLUS':
          () => this.openSofiPlus(1),
        'SOFiSTiK-atom:create-file-SOFiPLUS':
          () => this.openSofiPlus(2),
        'SOFiSTiK-atom:calculation-WPS-2020':
          () => this.runCalc('wps', '', '2020'),
        'SOFiSTiK-atom:calculation-WPS-2018':
          () => this.runCalc('wps', '', '2018'),

        'SOFiSTiK-atom:open-help-AQUA-EN':
          () => this.openHelpPDF('aqua_1'),
        'SOFiSTiK-atom:open-help-externally-AQUA-EN':
          () => this.openHelpPDFExternal('aqua_1'),
      })
    )
  },

  getSofPath(ver=null) {
    envPath = atom.config.get('sofistik-atom.envPath')

    if (ver==null) {ver = atom.config.get('sofistik-atom.version')}

    if (ver=='2020') {
      sofPaths = [
        path.join(atom.config.get('sofistik-atom.envPath'),
          '2020'),

        path.join(atom.config.get('sofistik-atom.envPath'),
          '2020','SOFiSTiK 2020'),

        path.join(atom.config.get('sofistik-atom.envPath'),
          '2020','SOFiPLUS 2020 (AutoCAD 2020)'),
      ]


    } else if (ver=='2018') {
      sofPaths = [
        path.join(atom.config.get('sofistik-atom.envPath'),
          '2018'),

        path.join(atom.config.get('sofistik-atom.envPath'),
          '2018','SOFiSTiK 2018'),

        path.join(atom.config.get('sofistik-atom.envPath'),
          '2018','SOFiPLUS 2018 (AutoCAD 2018)'),
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
    exec('"'+this.getSofPath(ver)[1] + '\\ted.exe" '+parameters+' "'+path1+'"')
  },

  openHelpPDF(name, ver=null) {
    path1 = path.join(this.getSofPath(ver)[1], name+'.pdf')
    if (fs.existsSync(path1)) {
      atom.workspace.open(path1)
    } else {
      atom.notifications.addError('Can not open PDF file "'+path1+'", because it does not exists')
    }
  },

  openHelpPDFExternal(name, ver=null) {
    path1 = path.join(this.getSofPath(ver)[1], name+'.pdf')
    if (fs.existsSync(path1)) {
      shell.openItem(path1)
    } else {
      atom.notifications.addError('Can not open PDF file "'+path1+'", because it does not exists')
    }
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
      exec('"'+this.getSofPath(ver)[2] + '\\sofiplus_launcher.exe" "'+path1+'"')
    } else if (mode==1) {
      if (!fs.existsSync(path1)) {
        atom.notifications.addError('File "'+path1+'" does not exists')
      } else {
        exec('"'+this.getSofPath(ver)[2] + '\\sofiplus_launcher.exe" "'+path1+'"')
      }
    } else if (mode==2) {
      if (!fs.existsSync(path1)) {
        exec('"'+this.getSofPath(ver)[2] + '\\sofiplus_launcher.exe" "'+path1+'"')
      } else {
        atom.notifications.addError('File "'+path1+'" already exists')
      }
    }
  },

};
