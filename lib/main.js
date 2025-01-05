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
      enum: ['2025', '2024', '2023', '2022', '2020', '2018'],
      default: '2025',
    },
    showKeystrokes: {
      order: 3,
      title: 'Enable keystroke hints',
      description: 'Show info message with keystroke in lists',
      type: 'boolean',
      default: true,
    },
  },

  activate () {
    this.helpList    = new HelpList(this)
    this.exampleList = new ExampleList(this)
    this.versionList = new VersionList()
    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.commands.add('atom-text-editor[data-grammar="source sofistik"]', {
        'sofistik-tools:current-help':
          () => this.currentHelp(1),
        'sofistik-tools:current-help-separately':
          () => this.currentHelp(2),
        'sofistik-tools:calculation-WPS':
          () => this.runCalc('wps'),
        'sofistik-tools:calculation-WPS-immediately':
          () => this.runCalc('wps', '-run -e'),
        'sofistik-tools:calculation-WPS-current':
          () => this.runCalcCurrentNow('wps'),
        'sofistik-tools:calculation-SPS-immediately':
          () => this.runCalc('sps'),
        'sofistik-tools:export-PLB-to-DOCX':
          () => this.exportPLB2DOCX(),
        'sofistik-tools:progam-current-toggle':
          () => this.changeProg(),
        'sofistik-tools:progam-all-toggle':
          () => this.changeProgs('all'),
        'sofistik-tools:progam-all-ON':
          () => this.changeProgs('all', 'ON'),
        'sofistik-tools:progam-all-OFF':
          () => this.changeProgs('all', 'OFF'),
        'sofistik-tools:progam-above-toggle':
          () => this.changeProgs('above'),
        'sofistik-tools:progam-above-ON':
          () => this.changeProgs('above', 'ON'),
        'sofistik-tools:progam-above-OFF':
          () => this.changeProgs('above', 'OFF'),
        'sofistik-tools:progam-below-toggle':
          () => this.changeProgs('below'),
        'sofistik-tools:progam-below-ON':
          () => this.changeProgs('below', 'ON'),
        'sofistik-tools:progam-below-OFF':
          () => this.changeProgs('below', 'OFF'),
        'sofistik-tools:clear-URS-tags':
          () => this.cleanUrsTags(),
        'sofistik-tools:open-animator':
          () => this.editorOpenAnimator(),
        'sofistik-tools:open-animator-2018':
          () => this.editorOpenAnimator({ version:'2018' }),
        'sofistik-tools:open-report':
          () => this.editorOpenReport(),
        'sofistik-tools:save-report-as-PDF':
          () => this.editorOpenReport({ parameters:['-t', '-printto:PDF'] }),
        'sofistik-tools:save-pictures-as-PDF':
          () => this.editorOpenReport({ parameters:['-g', '-picture:all', '-printto:PDF'] }),
        'sofistik-tools:open-protocol':
          () => this.editorOpenProtocol(),
        'sofistik-tools:open-viewer':
          () => this.editorOpenViewer(),
        'sofistik-tools:open-dbinfo':
          () => this.editorOpenDBNG(),
        'sofistik-tools:open-SSD':
          () => this.editorOpenSSD(),
        'sofistik-tools:open-wingraf':
          () => this.editorOpenWinGRAF(),
        'sofistik-tools:open-result-viewer':
          () => this.editorOpenResultViewer(),
        'sofistik-tools:open-teddy':
          () => this.editorOpenTeddy({ parameters:['-0'] }),
        'sofistik-tools:open-teddy-single':
          () => this.editorOpenTeddy({ parameters:['-nosingle'] }),
        'sofistik-tools:open-teddy-1':
          () => this.editorOpenTeddy({ parameters:['-1'] }),
        'sofistik-tools:open-teddy-2':
          () => this.editorOpenTeddy({ parameters:['-2'] }),
        'sofistik-tools:open-teddy-3':
          () => this.editorOpenTeddy({ parameters:['-3'] }),
        'sofistik-tools:open-teddy-4':
          () => this.editorOpenTeddy({ parameters:['-4'] }),
        'sofistik-tools:open-SOFiPLUS':
          () => this.editorOpenSOFiPLUS(),
        'sofistik-tools:export-CDB':
          () => this.editorOpenExportCDB(),
      }),
      atom.commands.add('atom-workspace', {
        'sofistik-tools:IFC-export':
          () => this.ifcExport(),
        'sofistik-tools:IFC-import':
          () => this.ifcImport(),
        'sofistik-tools:open-cdbase.chm':
          () => this.openCHM(),
      }),
      atom.commands.add('.tree-view', {
        'sofistik-tools:clean-glob':
          () => this.cleanCustomFilters(),
        'sofistik-tools:clean-1':
          () => this.cleanSelectedFolders('11'),
        'sofistik-tools:clean-1-recursively':
          () => this.cleanSelectedFolders('21'),
        'sofistik-tools:clean-2':
          () => this.cleanSelectedFolders('12'),
        'sofistik-tools:clean-2-recursively':
          () => this.cleanSelectedFolders('22'),
        'sofistik-tools:clean-3':
          () => this.cleanSelectedFolders('13'),
        'sofistik-tools:clean-3-recursively':
          () => this.cleanSelectedFolders('23'),
        'sofistik-tools:clean-4':
          () => this.cleanSelectedFolders('14'),
        'sofistik-tools:clean-4-recursively':
          () => this.cleanSelectedFolders('24'),
        'sofistik-tools:MSCA-fix':
          () => this.mscaFixTreeS(),
        'sofistik-tools:MSCA-fix-recursively':
          () => this.mscaFixTreeR(),
        'sofistik-tools:open-animator':
          () => this.treeOpenAnimator(),
        'sofistik-tools:open-animator-2018':
          () => this.treeOpenAnimator({ version:'2018' }),
        'sofistik-tools:open-report':
          () => this.treeOpenReport(),
        'sofistik-tools:save-report-as-PDF':
          () => this.treeOpenReport({ parameters:['-t', '-printto:PDF'] }),
        'sofistik-tools:save-pictures-as-PDF':
          () => this.treeOpenReport({ parameters:['-g', '-picture:all', '-printto:PDF'] }),
        'sofistik-tools:open-protocol':
          () => this.treeOpenProtocol(),
        'sofistik-tools:open-viewer':
          () => this.treeOpenViewer(),
        'sofistik-tools:open-dbinfo':
          () => this.treeOpenDBNG(),
        'sofistik-tools:open-SSD':
          () => this.treeOpenSSD(),
        'sofistik-tools:open-wingraf':
          () => this.treeOpenWinGRAF(),
        'sofistik-tools:open-result-viewer':
          () => this.treeOpenResultViewer(),
        'sofistik-tools:open-teddy':
          () => this.treeOpenTeddy({ parameters:['-0'] }),
        'sofistik-tools:open-teddy-single':
          () => this.treeOpenTeddy({ parameters:['-nosingle'] }),
        'sofistik-tools:open-teddy-1':
          () => this.treeOpenTeddy({ parameters:['-1'] }),
        'sofistik-tools:open-teddy-2':
          () => this.treeOpenTeddy({ parameters:['-2'] }),
        'sofistik-tools:open-teddy-3':
          () => this.treeOpenTeddy({ parameters:['-3'] }),
        'sofistik-tools:open-teddy-4':
          () => this.treeOpenTeddy({ parameters:['-4'] }),
        'sofistik-tools:open-SOFiPLUS':
          () => this.treeOpenSOFiPLUS(),
        'sofistik-tools:export-CDB':
          () => this.treeOpenExportCDB(),
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
    // TODO: scan dir for dat file, e.g. tree openers
    let envPath = atom.config.get('sofistik-tools.envPath')
    if (!version) {
      const editor = atom.workspace.getActiveTextEditor()
      if (editor && editor.getGrammar().scopeName==='source.sofistik') {
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
      atom.notifications.addError(`SOFiSTiK environment "${envPath}" version "${version}" is not available`)
      return
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
    if (onlyChildren) {
      atom.notifications.addInfo('Cannot run current program, because `@ only-children` has been used')
      return
    }
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
      atom.notifications.addWarning(`File doesn't exists "${pathSrc.replace(/\\/g, '\\\\')}"`)
      return
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
    } catch (err) {
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
    editor.transact(() => {
      editor.scan(/(prog +.+) urs.+/ig, (object) => {
        object.replace(object.match[1])
      })
    })
  },

  // ==== Open (Generic) ===== //

  runSOFiSTiK(prog, ext, filePath, props, prop2) {
    let args = []
    let sofPath = this.getSofPath(props ? props.version : null)
    if (!sofPath) { return }
    if (ext) {
      filePath = this.changeExtension(filePath, ext)
    }
    if (prop2 && prop2.existsCDB && !fs.existsSync(this.changeExtension(filePath, '.cdb'))) {
      atom.notifications.addWarning(`Database doesn't exists "${filePath.replace(/\\/g, '\\\\')}"`)
      return
    }
    let exists = fs.existsSync(filePath)
    if (prop2 && prop2.existsSkip) { // always add, if not exists too, e.g. WinGRAF
      args.push(filePath)
    } else if (prop2 && prop2.existsOnly) { // only if exists, but do not raise error, e.g. SOFiPLUS
      if (exists) { args.push(filePath) }
    } else if (!exists) { // if not exists, then raise error (default)
      atom.notifications.addWarning(`File doesn't exists "${filePath.replace(/\\/g, '\\\\')}"`)
      return
    } else { // if exists, then add filepath to args (default)
      args.push(filePath)
    }
    if (props && props.hasOwnProperty('parameters')) {
      args.push(...props.parameters)
    }
    if (prop2 && prop2.hasOwnProperty('parameters')) {
      args.push(...prop2.parameters)
    }
    return spawn(path.join(sofPath, prog), args, { cwd:path.dirname(filePath) })
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
      atom.notifications.addWarning(`File doesn't exists "${filePath.replace(/\\/g, '\\\\')}"`)
      return
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
    return this.runSOFiSTiK('wingraf.exe', '.gra', filePath, props, { existsSkip:true })
  },

  openResultViewer(filePath, props) {
    return this.runSOFiSTiK('resultviewer.exe', '.results', filePath, props, { existsOnly:true })
  },

  openTeddy(filePath, props) {
    return this.runSOFiSTiK('ted.exe', '.dat', filePath, props)
  },

  openSOFiPLUS(filePath, props) {
    return this.runSOFiSTiK('sofiplus_launcher.exe', '.dwg', filePath, props, { existsOnly:true })
  },

  openExportCDB(filePath, props) {
    return this.runSOFiSTiK('export.exe', '.cdb', filePath, props)
  },

  // ==== Open (Editor) ===== //

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
    const editor = atom.workspace.getActiveTextEditor()
    if (!props) { props = {} } ; if (!props.parameters) { props.parameters = [] }
    props.parameters.push(editor.getCursorBufferPosition().row+1)
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

  // ==== Open (Tree) ===== //

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
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$*|.#*|.grb|.err|.error_positions|.cfg)"
    } else if (filter==='21') {
      return '**/'+this.parseFilter('11')

    } else if (filter==='12') {
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$*|.#*|.grb|.err|.error_positions|.cfg|.cdi|.cde)"
    } else if (filter==='22') {
      return '**/'+this.parseFilter('12')

    } else if (filter==='13') {
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$*|.#*|.grb|.err|.error_positions|.cfg|.cdi|.cde|.cdb)"
    } else if (filter==='23') {
      return '**/'+this.parseFilter('13')

    } else if (filter==='14') {
      return "*@(.erg|.prt|.lst|.urs|.sdb|.db-2|.pl|.$*|.#*|.grb|.err|.error_positions|.cfg|.cdi|.cde|.cdb|.plb|.bak|_csm.dat|_csmlf.dat)"
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
          if (shell.moveItemToTrash) {
            shell.moveItemToTrash(file)
          } else {
            atom.trashItem(file)
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
