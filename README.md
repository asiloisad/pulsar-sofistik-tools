# sofistik-tools

**Support versions of SOFiSTiK are 2022, 2020 and 2018.**

A set of tools for cooperation with the SOFiSTiK software.

It best to use it with:
* [language-sofistik](https://atom.io/packages/language-sofistik): provide syntax and gramma settings,
* [autocomplete-sofistik](https://atom.io/packages/autocomplete-sofistik): autocomplete input,
* [pdf-viewer](https://atom.io/packages/pdf-viewer): PDF viewer with go-to-key possibility,
* [navigation-pane](https://atom.io/packages/navigation-pane): document outline.


## Configuration

The most important part is to correctly set the software installation path and the SOFiSTiK version. You can do it in package settings.

The package support shebang as regex `^@ SOFiSTiK (\d{4})(-\d\d?)?$`, e.g. `@ SOFiSTiK 2022`, `@ SOFiSTiK 2018`, `@ SOFiSTiK 2018-12`. This overwrite global package settings.


## Tools available in `source.sofistik` (e.g. `.dat` file)

The tools listed below should be called up via the Command Palette as `SOFiSTiK-tools:...`

| Tool | Description |
|-|-|
| `current-help` | open help for current module in Atom. if `pdf-viewer` package is installed, then you can activate `Scroll to keyword in help documents [experimental]` in package options for better positioning |
| `current-help-externally` | same as `current-help`, but in externally PDF viewer |
| `calculation-WPS` | open WPS with loaded `.dat` file |
| `calculation-WPS-immediately` | run calculation of file in WPS |
| `calculation-WPS-immediately-current-prog` | run calculation of current module in WPS |
| `calculation-SPS-immediately` | run calculation of file in SPS |
| `open-report` | open `.plb` file with ReportViewer |
| `open-report-automatic-refresh` | open `.plb` file with ReportViewer with flag to automatically refresh file if changed |
| `save-report-as-PDF` | convert `.plb` to `.pdf` |
| `save-pictures-as-PDF` | export images from `.plb` |
| `open-protocol` | open protocol document |
| `open-Animator` | open `.cdb` in Animator or System Visualization |
| `open-SSD` | open `.sofistik` file in SSD |
| `open-WinGRAF` | open `.gra` file with same name as `.dat` file |
| `open-Result-Viewer` | open `.result` file with same name as `.dat` file |
| `open-Teddy` | open `.dat` file externally in Teddy |
| `open-Teddy-1` | open `.dat` file externally in Teddy in slot 1 |
| `open-Teddy-2` | open `.dat` file externally in Teddy in slot 2 |
| `open-Teddy-3` | open `.dat` file externally in Teddy in slot 3 |
| `open-Teddy-4` | open `.dat` file externally in Teddy in slot 4 |
| `open-or-create-file-SOFiPLUS` | open `.dwg` file in SOFiPLUS with same name as `.dat` file |
| `open-file-SOFiPLUS` | open `.dwg` file only if exists |
| `create-file-SOFiPLUS` | create `.dwg` file only if not exists |
| `export-CDB-to-DAT` | open export window from `.cdb` to `.dat` |
| `export-PLB-to-DOCX` | convert `.plb` file to `.docx`; work only with SOFiSTiK 2020 or higher versions |
| `PROG-current-toggle` | toggle state of PROG of current program |
| `PROG-all-toggle` | toggle all programs |
| `PROG-all-ON` | turn ON all programs |
| `PROG-all-OFF` | turn OFF all programs |
| `PROG-above-toggle` | toggle programs above cursor |
| `PROG-above-ON` | turn ON programs above cursor |
| `PROG-above-OFF` | turn OFF programs above cursor |
| `PROG-below-toggle` | toggle programs below cursor |
| `PROG-below-ON` | turn ON programs below cursor |
| `PROG-below-OFF` | turn OFF programs below cursor |


## Tools available in `atom-workspace`

The tools listed below should be called up via the Command Palette as `SOFiSTiK-tools:...`

| Tool | Description |
|-|-|
| `open-help` | open window to choose help document; press `enter` to open help inside atom or `alt-enter` to open externally; open inside atom is possible only with any PDF viewer package, e.g. [pdf-viewer](https://atom.io/packages/pdf-viewer) |
| `IFC-export` | open IFC export window |
| `IFC-import` | open IFC import window |
| `change-version` | change globally version of SOFiSTiK program without menu |
| `open-CDBASE.CHM` | open database description externally; `.chm` browser must be available in system |


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
