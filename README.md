# sofistik-tools

A set of tools for cooperation with the SOFiSTiK software.

It best to use it with atom packages:
* [language-sofistik](https://atom.io/packages/language-sofistik): provide syntax and gramma settings,
* [autocomplete-sofistik](https://atom.io/packages/autocomplete-sofistik): autocomplete for SOFiSTiK,
* [pdf-viewer](https://atom.io/packages/pdf-viewer): PDF viewer with go-to-key possibility,
* [navigation-pane](https://atom.io/packages/navigation-pane): document outline.


## Configuration

The most important part is to correctly set the software installation path and the SOFiSTiK version. You can do it in package settings.

The package support custom shebang (first line of file) as `/^! SOFiSTiK (\d{4})(-\d\d?)?$/`, e.g. `! SOFiSTiK 2022`, `! SOFiSTiK 2018`, `! SOFiSTiK 2018-12`. This overwrite global package settings. It is usefull to put this information into `.dat`, because it will be much easier to reboot a project while keeping the initial version of the project.


## Tools available in `source.sofistik` (e.g. `.dat` file)

The tools listed below should be called up via the Command Palette as `SOFiSTiK-tools:...`

| Tool | Description |
|-|-|
| `current-help` | open PDF help for current module in default atom pdf-viewer. if `pdf-viewer` package is installed, then you can activate `Scroll to keyword in help documents` in package options |
| `current-help-externally` | same as `current-help`, but in externally pdf-viewer |
| `calculation-WPS` | open Window Parser with loaded `.dat` file |
| `calculation-WPS-immediately` | run calculation of file in WPS |
| `calculation-WPS-immediately-current-prog` | run calculation of current module in WPS |
| `calculation-SPS-immediately` | run calculation of file in SPS |
| `open-report` | open `.plb` file with Report Viewer, only if `.plb` available |
| `open-report-automatic-refresh` | open `.plb` file with ReportViewer with flag to automatically refresh file if changed, only if `.plb` available |
| `save-report-as-PDF` | convert `.plb` to `.pdf` |
| `save-pictures-as-PDF` | export images from `.plb` |
| `open-protocol` | open protocol (text file) |
| `open-Animator` | open `.cdb` in Animator or System Visualization |
| `open-SSD` | open `.sofistik` file in SSD |
| `open-WinGRAF` | open `.gra` file with same name as `.dat` file |
| `open-Result-Viewer` | open `.result` file with same name as `.dat` file |
| `open-Teddy` | open `.dat` file externally in Teddy |
| `open-Teddy-1` | open `.dat` file externally in Teddy (slot 1) |
| `open-Teddy-2` | open `.dat` file externally in Teddy (slot 2) |
| `open-Teddy-3` | open `.dat` file externally in Teddy (slot 3) |
| `open-Teddy-4` | open `.dat` file externally in Teddy (slot 4) |
| `open-or-create-file-SOFiPLUS` | open `.dwg` file in SOFiPLUS with same name as `.dat` file |
| `open-file-SOFiPLUS` | open `.dwg` file only if exists |
| `create-file-SOFiPLUS` | create `.dwg` file only if not exists |
| `export-CDB-to-DAT` | open export window from `.cdb` to `.dat` |
| `export-PLB-to-DOCX` | convert `.plb` file (with same name as `.dat`) to Word. work only with 2020 or higher versions |
| `PROG-current-toggle` | toggle state of PROG of current program |
| `PROG-all-toggle` | toggle all programs |
| `PROG-all-ON` | turn on all programs |
| `PROG-all-OFF` | turn off all programs |
| `PROG-above-toggle` | toggle programs above cursor |
| `PROG-above-ON` | turn on programs above cursor |
| `PROG-above-OFF` | turn off programs above cursor |
| `PROG-below-toggle` | toggle programs below cursor |
| `PROG-below-ON` | turn on programs below cursor |
| `PROG-below-OFF` | turn off programs below cursor |


## Tools available in `atom-workspace`

The tools listed below should be called up via the Command Palette as `SOFiSTiK-tools:...`

| Tool | Description |
|-|-|
| `open-help` | open window to choose help document; press `enter` to open help inside atom or `alt-enter` to open externally; open inside atom is possible only with any pdf-viewer package, e.g. [pdf-viewer](https://atom.io/packages/pdf-viewer) |
| `IFC-export` | open IFC export window |
| `IFC-import` | open IFC import window |
| `change-version` | change globally version of SOFiSTiK program without menu |
| `open-CDBASE.CHM` | open database description externally; any `.chm` browser must be available in system |


## Tools available in `.tree-view`

The tools listed below should be called up via the Command Palette as `SOFiSTiK-tools:...`

| Tool | Description |
|-|-|
| `clean-[S]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB]` | delete files only in selected paths |
| `clean-[R]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB]` | delete files recursively from selected paths |
| `clean-[S]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB-CDI-CDE]` | delete files only in selected paths |
| `clean-[R]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB-CDI-CDE]` | delete files recursively from selected paths |
| `clean-[S]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB-CDI-CDE-CDB]` | delete files only in selected paths |
| `clean-[R]-[ERG-PRT-LST-URS-SDB-PL-$??-#??-GRB-CDI-CDE-CDB]` | delete files recursively from selected paths |
