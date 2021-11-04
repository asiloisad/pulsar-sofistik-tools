# sofistik-tools

A set of tools for cooperation with the SOFiSTiK software.

It best to use it with atom package [language-sofistik](https://atom.io/packages/language-sofistik) which provide syntax and gramma settings.


## Configuration

The most important part is to correctly set the software installation path and the SOFiSTiK version. You can do it in package settings.


## Tools available in `source.sofistik` (e.g. `.dat` file)

The tools listed below should be called up via the Command Palette as `SOFiSTiK-tools:...`

| Tool | Description |
|-|-|
| `calculation-WPS` | open Window Parser with loaded `.dat` file |
| `calculation-WPS-immediately` | run calculation of file in WPS |
| `calculation-SPS-immediately` | run calculation of file in SPS |
| `calculation-WPS-2020` | force to use WPS from SOFiSTiK 2020 |
| `calculation-WPS-2018` | force to use WPS from SOFiSTiK 2020 |
| `open-report` | open `.plb` file with ReportViewer, only if `.plb` available |
| `open-report-automatic-refresh` | open `.plb` file with ReportViewer with flag to automatically refresh file if changed, only if `.plb` available |
| `save-report-as-PDF` | convert `.plb` to `.pdf` |
| `save-pictures-as-PDF` | export images from `.plb` |
| `open-protocol` | open protocol (text file) |
| `open-Animator` | open `.cdb` in Animator or System Visualization |
| `open-Animator-2018` | force to open `.cdb` in Animator 2018 independent of version setting |
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
| `export-PLB-to-DOCX` | convert `.plb` file (with same name as `.dat`) to Word; work only with 2020 version |
| `PROG-current-toggle` | toggle prog of current program |
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
| `open-help` | open window to choose help document; press `enter` to open help inside atom or `alt-enter` to open externally; open inside atom is possible only with any pdf-viewer package (e.g. [pdfjs-viewer](https://atom.io/packages/pdfjs-viewer)) |
| `IFC-export` | open IFC export window |
| `IFC-import` | open IFC import window |
| `open-CDBASE.CHM` | open database description externally; any `.chm` browser must be available in system |


## Tools available in `.tree-view`

The tools listed below should be called up via the Command Palette as `SOFiSTiK-tools:...`

| Tool | Description |
|-|-|
| `clean-[S]-[ERG-PRT-LST-PL-$??-#??-GRB]` | delete files only in selected paths |
| `clean-[R]-[ERG-PRT-LST-PL-$??-#??-GRB]` | delete files recursively from selected paths |
| `clean-[S]-[ERG-PRT-LST-PL-$??-#??-GRB-CDI-CDE]` | delete files only in selected paths |
| `clean-[R]-[ERG-PRT-LST-PL-$??-#??-GRB-CDI-CDE]` | delete files recursively from selected paths |
| `clean-[S]-[ERG-PRT-LST-PL-$??-#??-GRB-CDI-CDE-CDB]` | delete files only in selected paths |
| `clean-[R]-[ERG-PRT-LST-PL-$??-#??-GRB-CDI-CDE-CDB]` | delete files recursively from selected paths |
