'use babel'

import { Disposable, CompositeDisposable, Point } from 'atom'
import { exec, spawn } from 'child_process'
import { shell } from 'electron'
import path from 'path'
import fs from 'fs'
import { glob } from 'glob'
import ExampleList from './example-list'
import HelpList from './help-list'
import VersionList from './version-list'
import TextView from './text-view'

export default {

  config: {
    envPath: {
      order: 1,
      title: 'SOFiSTiK installation path',
      description: 'Path to the folder with the SOFiSTiK installation',
      type: 'string',
      default: 'C:\\Program Files\\SOFiSTiK'
    },
    version: {
      order: 2,
      title: 'SOFiSTiK program version',
      description: 'Select the software version for which the programs will be used. Make sure the software and the license are available on your computer',
      type: 'string',
      enum: ['2024', '2023', '2022', '2020', '2018'],
      default: '2024',
    },
    showKeystrokes: {
      order: 4,
      title: 'Enable keystroke hints',
      description: 'Show info message with keystroke in lists',
      type: 'boolean',
      default: true,
    },
    debugMode: {
      order: 5,
      title: 'Debug mode',
      description: 'Show debug informations in program console',
      type: 'boolean',
      default: false,
    },
  },

  activate () {
    this.helpList    = new HelpList(this)
    this.exampleList = new ExampleList(this)
    this.versionList = new VersionList()
    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.commands.add('atom-text-editor[data-grammar="source sofistik"]', {

        // upgrade needed
        'SOFiSTiK-tools:current-help':
          () => this.currentHelp(1),
        'SOFiSTiK-tools:current-help-[M]':
          () => this.currentHelp(2),
        'SOFiSTiK-tools:current-help-[E]':
          () => this.currentHelp(3),
        'SOFiSTiK-tools:calculation-WPS':
          () => this.runCalc('wps'),
        'SOFiSTiK-tools:calculation-WPS-immediately':
          () => this.runCalc('wps', '-run -e'),
        'SOFiSTiK-tools:calculation-WPS-current':
          () => this.runCalcCurrentNow('wps'),
        'SOFiSTiK-tools:calculation-SPS-immediately':
          () => this.runCalc('sps'),
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
        'SOFiSTiK-tools:clear-URS-tags':
          () => this.cleanUrsTags(),

        // upgrade done
        'SOFiSTiK-tools:open-Animator':
          () => this.editorOpenAnimator(),
        'SOFiSTiK-tools:open-Animator-2018':
          () => this.editorOpenAnimator({ version:'2018' }),
        'SOFiSTiK-tools:open-report':
          () => this.editorOpenReport(),
        'SOFiSTiK-tools:open-report-auto-refresh':
          () => this.editorOpenReport({ parameters:['-r'] }),
        'SOFiSTiK-tools:save-report-as-PDF':
          () => this.editorOpenReport({ parameters:['-t', '-printto:PDF'] }),
        'SOFiSTiK-tools:save-pictures-as-PDF':
          () => this.editorOpenReport({ parameters:['-g', '-picture:all', '-printto:PDF'] }),
        'SOFiSTiK-tools:open-protocol':
          () => this.editorOpenProtocol(),
        'SOFiSTiK-tools:open-Viewer':
          () => this.editorOpenViewer(),
        'SOFiSTiK-tools:open-DB-info':
          () => this.editorOpenDBNG(),
        'SOFiSTiK-tools:open-SSD':
          () => this.editorOpenSSD(),
        'SOFiSTiK-tools:open-WinGRAF':
          () => this.editorOpenWinGRAF(),
        'SOFiSTiK-tools:open-Result-Viewer':
          () => this.editorOpenResultViewer(),
        'SOFiSTiK-tools:open-Teddy':
          () => this.editorOpenTeddy({ parameters:['-0'] }),
        'SOFiSTiK-tools:open-Teddy-single':
          () => this.editorOpenTeddy({ parameters:['-nosingle'] }),
        'SOFiSTiK-tools:open-Teddy-1':
          () => this.editorOpenTeddy({ parameters:['-1'] }),
        'SOFiSTiK-tools:open-Teddy-2':
          () => this.editorOpenTeddy({ parameters:['-2'] }),
        'SOFiSTiK-tools:open-Teddy-3':
          () => this.editorOpenTeddy({ parameters:['-3'] }),
        'SOFiSTiK-tools:open-Teddy-4':
          () => this.editorOpenTeddy({ parameters:['-4'] }),
        'SOFiSTiK-tools:open-SOFiPLUS':
          () => this.editorOpenSOFiPLUS(),
        'SOFiSTiK-tools:export-CDB':
          () => this.editorOpenExportCDB(),
      }),
      atom.commands.add('atom-workspace', {

        // upgrade needed
        'SOFiSTiK-tools:IFC-export':
          () => this.ifcExport(),
        'SOFiSTiK-tools:IFC-import':
          () => this.ifcImport(),
        'SOFiSTiK-tools:open-cdbase.chm':
          () => this.openCHM(),
      }),
      atom.commands.add('.tree-view', {

        // upgrade needed
        'SOFiSTiK-tools:clean-by-glob-pattern':
          () => this.cleanCustomFilters(),
        'SOFiSTiK-tools:clean-[S]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB]':
          () => this.cleanSelectedFolders('11'),
        'SOFiSTiK-tools:clean-[R]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB]':
          () => this.cleanSelectedFolders('21'),
        'SOFiSTiK-tools:clean-[S]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE]':
          () => this.cleanSelectedFolders('12'),
        'SOFiSTiK-tools:clean-[R]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE]':
          () => this.cleanSelectedFolders('22'),
        'SOFiSTiK-tools:clean-[S]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE-CDB]':
          () => this.cleanSelectedFolders('13'),
        'SOFiSTiK-tools:clean-[R]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE-CDB]':
          () => this.cleanSelectedFolders('23'),
        'SOFiSTiK-tools:clean-[S]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE-CDB-PLB-BAK-SDB-DOCX-CFG-CSM]':
          () => this.cleanSelectedFolders('14'),
        'SOFiSTiK-tools:clean-[R]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE-CDB-PLB-BAK-SDB-DOCX-CFG-CSM]':
          () => this.cleanSelectedFolders('24'),
        'SOFiSTiK-tools:MSCA-Fix-[S]':
          () => this.mscaFixTreeS(),
        'SOFiSTiK-tools:MSCA-Fix-[R]':
          () => this.mscaFixTreeR(),

        // upgrade done
        'SOFiSTiK-tools:open-Animator':
          () => this.treeOpenAnimator(),
        'SOFiSTiK-tools:open-Animator-2018':
          () => this.treeOpenAnimator({ version:'2018' }),
        'SOFiSTiK-tools:open-report':
          () => this.treeOpenReport(),
        'SOFiSTiK-tools:open-report-auto-refresh':
          () => this.treeOpenReport({ parameters:['-r'] }),
        'SOFiSTiK-tools:save-report-as-PDF':
          () => this.treeOpenReport({ parameters:['-t', '-printto:PDF'] }),
        'SOFiSTiK-tools:save-pictures-as-PDF':
          () => this.treeOpenReport({ parameters:['-g', '-picture:all', '-printto:PDF'] }),
        'SOFiSTiK-tools:open-protocol':
          () => this.treeOpenProtocol(),
        'SOFiSTiK-tools:open-Viewer':
          () => this.treeOpenViewer(),
        'SOFiSTiK-tools:open-DB-info':
          () => this.treeOpenDBNG(),
        'SOFiSTiK-tools:open-SSD':
          () => this.treeOpenSSD(),
        'SOFiSTiK-tools:open-WinGRAF':
          () => this.treeOpenWinGRAF(),
        'SOFiSTiK-tools:open-Result-Viewer':
          () => this.treeOpenResultViewer(),
        'SOFiSTiK-tools:open-Teddy':
          () => this.treeOpenTeddy({ parameters:['-0'] }),
        'SOFiSTiK-tools:open-Teddy-single':
          () => this.treeOpenTeddy({ parameters:['-nosingle'] }),
        'SOFiSTiK-tools:open-Teddy-1':
          () => this.treeOpenTeddy({ parameters:['-1'] }),
        'SOFiSTiK-tools:open-Teddy-2':
          () => this.treeOpenTeddy({ parameters:['-2'] }),
        'SOFiSTiK-tools:open-Teddy-3':
          () => this.treeOpenTeddy({ parameters:['-3'] }),
        'SOFiSTiK-tools:open-Teddy-4':
          () => this.treeOpenTeddy({ parameters:['-4'] }),
        'SOFiSTiK-tools:open-SOFiPLUS':
          () => this.treeOpenSOFiPLUS(),
        'SOFiSTiK-tools:export-CDB':
          () => this.treeOpenExportCDB(),
      }),
      atom.config.observe('sofistik-tools.debugMode', (value) => {
        this.debugMode = value
      }),
    )
    this.keywords = null ; this.loader()
  },

  deactivate () {
    this.disposables.dispose()
    this.helpList.destroy()
    this.versionList.destroy()
  },

  loader() {
    let langPath = atom.packages.resolvePackagePath('language-sofistik')
    if (!langPath) { return }
    let keyPath = path.join(langPath, 'assets', 'keywords.json')
    try { this.keywords = JSON.parse(fs.readFileSync(keyPath))
    } catch (e) { return }
  },

  getSofPath(version) {
    let envPath = atom.config.get('sofistik-tools.envPath')
    if (!version) {
      const editor = atom.workspace.getActiveTextEditor()
      if (editor) {
        editor.backwardsScanInBufferRange(/^@ *SOFiSTiK *(\d{4})(-\d\d?)? *$/, [Point.ZERO, editor.getCursorBufferPosition()],
          (item) => { version = item.match[1] ; item.stop() })
      }
    }
    if (!version) {
      version = atom.config.get('sofistik-tools.version')
    }
    let sofPath = path.join(envPath, version, 'SOFiSTiK '+version)
    if (fs.existsSync(sofPath)) {
      return sofPath
    } else {
      return atom.notifications.addError(`SOFiSTiK environment "${envPath}" version "${version}" is not available`)
    }
  },

  async runCalc(parser, parameters='', version) {
    let timeout = 0
    const editor = atom.workspace.getActiveTextEditor()
    let editorPath = editor.getPath() ; if (!editorPath) { return }
    let pathSrcs = [] ; let cmode = true
    editor.scan(/^@ +only-children/gm, (item) => {
      cmode = false ; item.stop()
    }) ; if (cmode) { pathSrcs.push(editorPath) }
    editor.scan(/^@ child:(.+)$/gm, (item) => {
      timeout = 100
      pathSrcs.push(path.join(path.dirname(editorPath), item.match[1].trim()))
    })
    editor.save() // like teddy
    let sofPath = this.getSofPath(version) ; if (!sofPath) { return }
    let parserPath = `${sofPath}\\${parser}.exe`
    for (let pathSrc of pathSrcs) {
      if (!fs.existsSync(pathSrc)) {
        atom.notifications.addWarning(`File doesn't exists "${pathSrc.replace(/\\/g, '\\\\')}"`)
        continue
      }
      exec(`"${parserPath}" "${pathSrc}" ${parameters}`)
      await new Promise(resolve => setTimeout(resolve, timeout))
    }
  },

  runCalcCurrentNow(parser, version) {
    const editor = atom.workspace.getActiveTextEditor()
    let onlyChildren = false
    editor.scan(/^@ +only-children/gm, (item) => {
      onlyChildren = true ; item.stop()
    })
    if (onlyChildren) { return atom.notifications.addInfo('Cannot run current program, because `@ only-children` has been used') }
    let pathSrc = editor.getPath() ; if (!pathSrc) { return }
    editor.save()
    let range = [[0,0], editor.getCursorBufferPosition()]
    let line
    let sofPath = this.getSofPath(version) ; if (!sofPath) { return }
    editor.backwardsScanInBufferRange(/(?:prog|sys|apply|chapter) /ig, range, (object) => {
      line = object.range.start.row
      exec(`"${sofPath}\\${parser}.exe" "${pathSrc}" -run:${line+1} -e`)
      object.stop()
      return
    })
  },

  ifcExport(version){
    let sofPath = this.getSofPath(version) ; if (!sofPath) { return }
    exec(`"${sofPath}\\ifcexport_gui.exe"`)
  },

  ifcImport(version){
    let sofPath = this.getSofPath(version) ; if (!sofPath) { return }
    exec(`"${sofPath}\\ifcimport_gui.exe"`)
  },

  exportPLB2DOCX(version){
    const editor = atom.workspace.getActiveTextEditor()
    let path0 = editor.getPath()
    let pathSrc = path0.replace('.dat', '.plb');
    let pathDst = path0.replace('.dat', '.docx');
    if (!fs.existsSync(pathSrc)) {
      return atom.notifications.addWarning(`File doesn't exists "${pathSrc.replace(/\\/g, '\\\\')}"`)
    }
    let sofPath = this.getSofPath(version) ; if (!sofPath) { return }
    exec(`"${sofPath}\\plbdocx.exe" -f "${pathSrc}" -o "${pathDst}"`)
  },

  openCHM(version) {
    let sofPath = this.getSofPath(version) ; if (!sofPath) { return }
    shell.openPath(`${sofPath}\\cdbase.chm`)
  },

  changeProg() {
    const editor = atom.workspace.getActiveTextEditor()
    let range = [[0,0], editor.getCursorBufferPosition()]
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

  mscaFix(dirPaths, filter) {
    for (let dirPath of dirPaths) {
      if (!fs.statSync(dirPath).isDirectory()) {
        this.mscaFixer(dirPath)
        continue
      }
      glob(filter, { cwd:dirPath, nosort:true, silent:true, nodir:true }).then((files, err) => {
        if (err & this.debugMode) { console.log(err) }
        for (let file of files) { this.mscaFixer(path.join(dirPath, file)) }
      })
    }
  },

  mscaFixer(filePath) {
    try {
      let data = fs.readFileSync(filePath, 'utf8')
      data = data.replace(/ +MSCA \w+/gmi, '')
      data = data.replace(/^AND (.*)(?<!MSCA .*)$/gmi, 'AND $1 MSCA NO')
      fs.writeFileSync(filePath, data, { encoding:'utf8' })
      if (this.debugMode) { console.log('MSCA-FIX:', filePath) }
    } catch (err) {
      if (this.debugMode) { console.log(err) }
    }
  },

  mscaFixTreeS() {
    this.mscaFix(this.treeView.selectedPaths(), '*.gra')
  },

  mscaFixTreeR() {
    this.mscaFix(this.treeView.selectedPaths(), '**/*.gra')
  },

  cleanUrsTags() {
    const editor = atom.workspace.getActiveTextEditor()
    editor.scan(/(prog +.+) urs.+/ig, (object) => {
      object.replace(object.match[1])
    })
  },

  // ==== Open::Generic ===== //

  runSOFiSTiK(prog, ext, filePath, props) {
    let sofPath = this.getSofPath(props ? props.version : null) ; if (!sofPath) { return }
    if (ext) {
      filePath = this.changeExtension(filePath, ext)
    }
    if (!fs.existsSync(filePath)) {
      return atom.notifications.addWarning(`File doesn't exists "${filePath.replace(/\\/g, '\\\\')}"`)
    }
    let args = [filePath]
    if (props && props.hasOwnProperty('parameters')) {
      args.push(...parameters)
    }
    return spawn(path.join(sofPath, prog), args)
  },

  openAnimator(filePath, props) {
    return this.runSOFiSTiK('animator.exe', '.cdb', filePath, props)
  },

  openReport(filePath, props) {
    return this.runSOFiSTiK('ursula.exe', '.plb', filePath, props)
  },

  openProtocol(filePath, props) {
    let sofPath = this.getSofPath(props ? props.version : null) ; if (!sofPath) { return }
    filePath = this.changeExtension(filePath, '.prt')
    if (!fs.existsSync(filePath)) {
      return atom.notifications.addWarning(`File doesn't exists "${filePath.replace(/\\/g, '\\\\')}"`)
    }
    return atom.workspace.open(filePath)
  },

  openViewer(filePath, props) {
    return this.runSOFiSTiK('fea_viewer.exe', '.cdb', filePath, props)
  },

  openDBNG(filePath, props) {
    return this.runSOFiSTiK('dbinfo_ng.exe', '.cdb', filePath, props)
  },

  openSSD(filePath, props) {
    return this.runSOFiSTiK('ssd.exe', '.sofistik', filePath, props)
  },

  openWinGRAF(filePath, props) {
    return this.runSOFiSTiK('wingraf.exe', '.gra', filePath, props)
  },

  openResultViewer(filePath, props) {
    return this.runSOFiSTiK('resultviewer.exe', '.results', filePath, props)
  },

  openTeddy(filePath, props) {
    return this.runSOFiSTiK('ted.exe', '.dat', filePath, props)
  },

  openSOFiPLUS(filePath, props) {
    return this.runSOFiSTiK('sofiplus_launcher.exe', '.dwg', filePath, props)
  },

  openExportCDB(filePath, props) {
    return this.runSOFiSTiK('export.exe', '.cdb', filePath, props)
  },

  // ==== Open::Editor ===== //

  getEditorPath() {
    try { return atom.workspace.getActiveTextEditor().getPath() } catch (e) { return }
  },

  editorOpenAnimator(props) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openAnimator(editorPath, props)
  },

  editorOpenReport(props) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openReport(editorPath, props)
  },

  editorOpenProtocol(props) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openProtocol(editorPath, props)
  },

  editorOpenViewer(props) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openViewer(editorPath, props)
  },

  editorOpenDBNG(props) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openDBNG(editorPath, props)
  },

  editorOpenSSD(props) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openSSD(editorPath, props)
  },

  editorOpenWinGRAF(props) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openWinGRAF(editorPath, props)
  },

  editorOpenResultViewer(props) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openResultViewer(editorPath, props)
  },

  editorOpenTeddy(props) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openTeddy(editorPath, props)
  },

  editorOpenSOFiPLUS(props) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openSOFiPLUS(editorPath, props)
  },

  editorOpenExportCDB(props) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openExportCDB(editorPath, props)
  },

  // ==== Open::Tree ===== //

  consumeTreeView(treeView) {
    this.treeView = treeView
    return new Disposable(() => { this.treeView = null });
  },

  getTreePaths() {
    if (!this.treeView) { return }
    return this.treeView.selectedPaths()
  },

  treeOpenAnimator(props) {
    let treePaths = this.getTreePaths() ; if (!treePaths) { return }
    return treePaths.map(filePath => this.openAnimator(filePath, props))
  },

  treeOpenReport(props) {
    let treePaths = this.getTreePaths() ; if (!treePaths) { return }
    return treePaths.map(filePath => this.openReport(filePath, props))
  },

  treeOpenProtocol(props) {
    let treePaths = this.getTreePaths() ; if (!treePaths) { return }
    return treePaths.map(filePath => this.openProtocol(filePath, props))
  },

  treeOpenViewer(props) {
    let treePaths = this.getTreePaths() ; if (!treePaths) { return }
    return treePaths.map(filePath => this.openViewer(filePath, props))
  },

  treeOpenDBNG(props) {
    let treePaths = this.getTreePaths() ; if (!treePaths) { return }
    return treePaths.map(filePath => this.openDBNG(filePath, props))
  },

  treeOpenSSD(props) {
    let treePaths = this.getTreePaths() ; if (!treePaths) { return }
    return treePaths.map(filePath => this.openSSD(filePath, props))
  },

  treeOpenWinGRAF(props) {
    let treePaths = this.getTreePaths() ; if (!treePaths) { return }
    return treePaths.map(filePath => this.openWinGRAF(filePath, props))
  },

  treeOpenResultViewer(props) {
    let treePaths = this.getTreePaths() ; if (!treePaths) { return }
    return treePaths.map(filePath => this.openResultViewer(filePath, props))
  },

  treeOpenTeddy(props) {
    let treePaths = this.getTreePaths() ; if (!treePaths) { return }
    return treePaths.map(filePath => this.openTeddy(filePath, props))
  },

  treeOpenSOFiPLUS(props) {
    let treePaths = this.getTreePaths() ; if (!treePaths) { return }
    return treePaths.map(filePath => this.openSOFiPLUS(filePath, props))
  },

  treeOpenExportCDB(props) {
    let treePaths = this.getTreePaths() ; if (!treePaths) { return }
    return treePaths.map(filePath => this.openExportCDB(filePath, props))
  },

  // ==== Cleaner ===== //

  parseFilter(filter) {
    if        (filter==='11') {
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$??|.#??|.grb)"
    } else if (filter==='21') {
      return '**/'+this.parseFilter('11')

    } else if (filter==='12') {
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$??|.#??|.grb|.cdi|.cde)"
    } else if (filter==='22') {
      return '**/'+this.parseFilter('12')

    } else if (filter==='13') {
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$??|.#??|.grb|.cdi|.cde|.cdb|.error_positions)"
    } else if (filter==='23') {
      return '**/'+this.parseFilter('13')

    } else if (filter==='14') {
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$??|.#??|.grb|.cdi|.cde|.cdb|.error_positions|.plb|.bak|.sdb|.docx|.cfg|_csm.dat|_csmlf.dat)"
    } else if (filter==='24') {
      return '**/'+this.parseFilter('14')

    } else { return filter }
  },

  cleanByPaths(dirPaths, filter) {
    filter = this.parseFilter(filter)
    for (let dirPath of dirPaths) {
      if (!fs.statSync(dirPath).isDirectory()) { continue }
      glob(filter, { cwd:dirPath, nosort:true, silent:true, nodir:true }).then((files) => {
        for (let file of files) {
          file = path.join(dirPath, file)
          if (!shell.moveItemToTrash(file)) {
            if (this.debugMode) { console.error('ERROR:', file) }
          } else {
            if (this.debugMode) { console.log('TRASH:', file) }
          }
        }
      })
    }
  },

  cleanSelectedFolders(filter) {
    this.cleanByPaths(this.treeView.selectedPaths(), filter)
  },

  cleanCustomFilters() {
    let textView = new TextView('', false, false, 'Enter the glob pattern to find the files to be deleted')
    textView.attach((filter) => { this.cleanSelectedFolders(filter) })
  },

  // ==== Help ===== //

  currentHelp(mode, version) {
    const editor = atom.workspace.getActiveTextEditor()
    let range = [Point.ZERO, editor.getLastCursor().getCurrentWordBufferRange().end]
    let prog, pro2, lang, postLang, flag
    let sofPath = this.getSofPath(version) ; if (!sofPath) { return }
    editor.backwardsScanInBufferRange(/^ *[\+\-\$]?prog +(\w+)/i, range, (object) => {
      prog = pro2 = object.match[1].toUpperCase()
      if (pro2.match(/wing/i)) {
        pro2 = 'wingraf'
      } else if (pro2.match(/results/i)) {
        pro2 = 'resultviewer'
      }
      lang = 'English'
      if (lang=='English') {
        postLang = '_1'
      } else if (lang=='Germany') {
        postLang = '_0'
      }
      if (fs.existsSync(filePath = path.join(sofPath, `${pro2}${postLang}.pdf`))) {
        flag = true
      } else if  (fs.existsSync(filePath = path.join(sofPath, `${pro2}.pdf`))) {
        flag = true
      } else {
        flag = false
      }
      if (flag) {
        if (mode===1) {
          this.inViewer(object, range, filePath, prog, true)
        } else if (mode===2) {
          this.inViewer(object, range, filePath, prog, false)
        } else if (mode===3) {
          this.exViewer(filePath)
        }
      } else {
        atom.notifications.addWarning(`Cannot find the manual for program "${prog}"`)
      }
      object.stop()
    })
  },

  getViewer(filePath, dest, tag) {
    let viewer;
    if (tag) {
      for (let item of atom.workspace.getPaneItems()) {
        if ('pdfjsPath' in item && item.hash && item.hash.endsWith('&SOFiSTiK')) {
          viewer = item
          atom.workspace.open(item.getURI(), { searchAllPanes:true, activatePane:false }) // focus
        }
      }
      tag = `&SOFiSTiK`
    } else {
      tag = this.makeID(9)
    }
    destCmd = dest ? `#nameddest=${dest}&${tag}` : `&${tag}`
    if (viewer) {
      if (viewer.getPath()===filePath) {
        if (dest) {
          viewer.scrollToDestination({ dest:dest, destHash:`#${dest}` })
        }
      } else {
        viewer.setFile(filePath, destCmd) ; viewer.reload()
      }
    } else {
      atom.workspace.open(`${filePath}${destCmd}`, { split:"right", activatePane:false })
    }
  },

  inViewer(object, range, filePath, prog, tag) {
    if (!atom.packages.isPackageActive('pdf-viewer')) {
      return atom.workspace.open(filePath, { split:"right", activatePane:false })
    }
    this.findQ = false
    if (this.keywords) {
      let regex = new RegExp('(?:^[ \\t]*|; *)('+Object.keys(this.keywords[prog]).join('|')+')\\b', 'i')
      let nange = [object.range.start, range[1]]
      const editor = atom.workspace.getActiveTextEditor()
      editor.backwardsScanInBufferRange(regex, nange, (finder) => {
        this.getViewer(filePath, finder.match[1].toUpperCase(), tag)
        this.findQ = true
        finder.stop()
      })
    }
    if (!this.findQ) { this.getViewer(filePath, false, tag) }
  },

  exViewer(filePath) {
    shell.openPath(filePath)
  },

  makeID(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {result += characters.charAt(Math.floor(Math.random() *charactersLength))}
    return result;
  },

  // ==== Tools ===== //

  changeExtension(filePath, ext) {
    if (!ext) { return filePath }
    let dotIndex = filePath.lastIndexOf('.')
    let slsIndex = filePath.lastIndexOf('/')
    let slbIndex = filePath.lastIndexOf('\\')
    if (dotIndex < Math.max(slsIndex, slbIndex)) {
      return filePath + ext
    } else {
      return filePath.substr(0, dotIndex) + ext
    }
  },
}
