'use babel'

import { CompositeDisposable } from 'atom'
import HelpView from './help-view'
import { exec } from 'child_process'
import { TextEditor } from 'atom';

// https://www.electronjs.org/docs/api/shell
const { shell } = require('electron')

const path = require('path');

var fs = require("fs")

class VersionView {

    constructor(serializedState) {
        this.paneItem = null;

        this.miniEditor = new TextEditor({ mini: true });
        this.miniEditor.element.addEventListener('blur', this.close.bind(this));
        this.miniEditor.setPlaceholderText('Enter SOFiSTiK version');

        this.message = document.createElement('div');
        this.message.classList.add('message');

        this.element = document.createElement('div');
        this.element.classList.add('man');
        this.element.appendChild(this.miniEditor.element);
        this.element.appendChild(this.message);

        this.panel = atom.workspace.addModalPanel({
            item: this,
            visible: false,
        });

        atom.commands.add(this.miniEditor.element, 'core:confirm', () => {
            this.confirm();
        });
        atom.commands.add(this.miniEditor.element, 'core:cancel', () => {
            this.close();
        });
    }

    close() {
        if (! this.panel.isVisible()) return;
        this.miniEditor.setText('');
        this.panel.hide();
        if (this.miniEditor.element.hasFocus()) {
            this.restoreFocus();
        }
    }

    confirm() {
        const version = this.miniEditor.getText();
        this.close();

        atom.config.set('sofistik-atom.version', version)
    }

    storeFocusedElement() {
        this.previouslyFocusedElement = document.activeElement;
        return this.previouslyFocusedElement;
    }

    restoreFocus() {
        if (this.previouslyFocusedElement && this.previouslyFocusedElement.parentElement) {
            return this.previouslyFocusedElement.focus();
        }
        atom.views.getView(atom.workspace).focus();
    }

    open() {
        if (this.panel.isVisible()) return;
        this.storeFocusedElement();
        this.panel.show();
        this.message.textContent = 'Enter SOFiSTiK version, e.g. "2018", "2020"';
        this.miniEditor.element.focus();
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    setCurrentWord(w) {
        this.miniEditor.setText(w);
        this.miniEditor.selectAll();
    }

}


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
        'SOFiSTiK-atom:calculation-WPS':
          () => this.runCalc('wps'),
        'SOFiSTiK-atom:calculation-WPS-immediately':
          () => this.runCalc('wps', '-run -e'),
        'SOFiSTiK-atom:calculation-SPS-immediately':
          () => this.runCalc('sps'),
        'SOFiSTiK-atom:open-report':
          () => this.openReport(),
        'SOFiSTiK-atom:open-report-automatic-refresh':
          () => this.openReport('-r'),
        'SOFiSTiK-atom:save-report-as-PDF':
          () => this.openReport('-t -printto:PDF'),
        'SOFiSTiK-atom:save-pictures-as-PDF':
          () => this.openReport('-g -picture:all -printto:PDF'),
        'SOFiSTiK-atom:open-protocol':
          () => this.openProtocol(),
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
        'SOFiSTiK-atom:export-CDB-to-DAT':
          () => this.exportCDB2DAT(),
        'SOFiSTiK-atom:export-PLB-to-DOCX':
          () => this.exportPLB2DOCX(),

        'SOFiSTiK-atom:PROG-current-toggle': () => this.changeCurrentProg(),
        'SOFiSTiK-atom:PROG-all-toggle'    : () => this.changeProg ('all'),
        'SOFiSTiK-atom:PROG-all-on'        : () => this.changeProg1('all'),
        'SOFiSTiK-atom:PROG-all-off'       : () => this.changeProg0('all'),
        'SOFiSTiK-atom:PROG-above-toggle'  : () => this.changeProg ('above'),
        'SOFiSTiK-atom:PROG-above-on'      : () => this.changeProg1('above'),
        'SOFiSTiK-atom:PROG-above-off'     : () => this.changeProg0('above'),
        'SOFiSTiK-atom:PROG-below-toggle'  : () => this.changeProg ('below'),
        'SOFiSTiK-atom:PROG-below-on'      : () => this.changeProg1('below'),
        'SOFiSTiK-atom:PROG-below-off'     : () => this.changeProg0('below'),

    }))

    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'SOFiSTiK-atom:open-help':
          () => this.openHelpPDF(),
        'SOFiSTiK-atom:open-help-externally':
          () => this.openHelpPDFExternal(),
        'SOFiSTiK-atom:IFC-export':
          () => this.ifcExport(),
        'SOFiSTiK-atom:IFC-import':
          () => this.ifcImport(),
        'SOFiSTiK-atom:change-version':
          () => this.changeVersion(),
        'SOFiSTiK-atom:open-CDBASE.CHM':
          () => this.openCDBchm(),
    }))
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
