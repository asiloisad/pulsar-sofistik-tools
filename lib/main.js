'use babel'

import { CompositeDisposable } from 'atom'

import { execSync, exec } from 'child_process'

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
        'sofistik-atom:calculation-WPS':
          () => this.runCalc('wps'),
        'sofistik-atom:calculation-WPS-immediately':
          () => this.runCalc('wps', '-run -e'),
        'sofistik-atom:calculation-SPS':
          () => this.runCalc('sps'),
        'sofistik-atom:open-report':
          () => this.openReport(),
        'sofistik-atom:open-report-automatic-refresh':
          () => this.openReport('-r'),
        'sofistik-atom:save-report-as-PDF':
          () => this.openReport('-t -printto:PDF'),
        'sofistik-atom:save-pictures-as-PDF':
          () => this.openReport('-g -picture:all -printto:PDF'),
        'sofistik-atom:open-Teddy-1':
          () => this.openTeddy('-0'),
        'sofistik-atom:open-Teddy-2':
          () => this.openTeddy('-1'),
        'sofistik-atom:open-Teddy-3':
          () => this.openTeddy('-2'),
        'sofistik-atom:open-Teddy-4':
          () => this.openTeddy('-3'),
        'sofistik-atom:open-Teddy-5':
          () => this.openTeddy('-4'),
      })
    )
  },

  getSofPath() {
    envPath = atom.config.get('sofistik-atom.envPath')

    if (atom.config.get('sofistik-atom.version')=='2020') {
      sofPath = path.join(
        atom.config.get('sofistik-atom.envPath'),
        atom.config.get('sofistik-atom.version'),
        'SOFiSTiK 2020'
      )
    } else if (atom.config.get('sofistik-atom.version')=='2018') {
      sofPath = path.join(
        atom.config.get('sofistik-atom.envPath'),
        atom.config.get('sofistik-atom.version'),
        'SOFiSTiK 2018'
      )
    }

   if (!fs.existsSync(sofPath)) {
      atom.notifications.addError('SOFiSTiK environment "'+envPath+'" does not exists!')
    }

    return sofPath
  },

  runCalc(parser, parameters='') {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    editor.save()
    exec('"'+this.getSofPath() + '\\'+parser+'.exe" "'+path1+'" '+parameters)
  },

  openReport(parameters='') {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    path1 = path1.replace('.dat', '.plb');
    exec('"'+this.getSofPath() + '\\ursula.exe" '+parameters+' "'+path1+'"')
  },

  openTeddy(parameters='') {
    const editor = atom.workspace.getActivePaneItem()
    path1 = editor.buffer.file.path
    exec('"'+this.getSofPath() + '\\ted.exe" '+parameters+' "'+path1+'"')
  },
};
