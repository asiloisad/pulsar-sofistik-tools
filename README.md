# sofistik-tools

![Tag](https://img.shields.io/github/v/tag/bacadra/atom-sofistik-tools?style=for-the-badge)
![LastCommit](https://img.shields.io/github/last-commit/bacadra/atom-sofistik-tools?style=for-the-badge)
![RepoSize](https://img.shields.io/github/repo-size/bacadra/atom-sofistik-tools?style=for-the-badge)
![Licence](https://img.shields.io/github/license/bacadra/atom-sofistik-tools?style=for-the-badge)

A set of tools for cooperation with the SOFiSTiK software.

## Installation

### Atom Text Editor

The official Atom packages store has been disabled. To get latest version run the shell command

    apm install bacadra/atom-sofistik-tools

and obtain the package directly from Github repository.

### Pulsar Text Editor

The package has compability with [Pulsar](https://pulsar-edit.dev/) and can be install

    pulsar -p install bacadra/atom-sofistik-tools

or directly [sofistik-tools](https://web.pulsar-edit.dev/packages/sofistik-tools) from Pulsar package store.

## Compatibility

**Support versions of SOFiSTiK are 2023, 2022, 2020 and 2018. English only.**

As the package supports many versions of SOFiSTiK and commands are constantly changing, the package offers hints that may no longer be valid in given version.

## Configuration

The most important part is to correctly set the software installation path and the SOFiSTiK version. You can do it in package settings.

The package support shebang as regex `^@ SOFiSTiK (\d{4})(-\d\d?)?$`, e.g. `@ SOFiSTiK 2022`, `@ SOFiSTiK 2018`, `@ SOFiSTiK 2018-12`. This overwrite global package settings.

## Help view

The help view can be opened in any internal or external PDF viewers. If [pdf-viewer](https://github.com/bacadra/atom-pdf-viewer) is used, then help PDF file can be scrolled to current keyword.

## Tools available in `source.sofistik` (e.g. `.dat` file)

The tools listed below should be called up via the Command Palette as `SOFiSTiK-tools:...`

| Tool | Description |
|-|-|
| `current-help` | open help for current module in Atom in single pane |
| `current-help-multi` | open help for current module in Atom, but multi panes |
| `current-help-externally` | same as `current-help`, but in externally PDF viewer |
| `calculation-WPS` | open WPS with loaded `.dat` file |
| `calculation-WPS-immediately` | run calculation of file in WPS |
| `calculation-WPS-current` | run calculation of current module in WPS |
| `calculation-SPS-immediately` | run calculation of file in SPS |
| `open-report` | open `.plb` file with ReportViewer |
| `open-report-auto-refresh` | open `.plb` file with ReportViewer with flag to automatically refresh file if changed |
| `save-report-as-PDF` | convert `.plb` to `.pdf` |
| `save-pictures-as-PDF` | export images from `.plb` |
| `open-protocol` | open protocol document |
| `open-Animator` | open `.cdb` in Animator or System Visualization |
| `open-SSD` | open `.sofistik` file in SSD |
| `open-WinGRAF` | open `.gra` file with same name as `.dat` file |
| `open-Result-Viewer` | open `.result` file with same name as `.dat` file |
| `open-Teddy` | open `.dat` file externally in Teddy |
| `open-Teddy-single` | open `.dat` file externally in Teddy |
| `open-Teddy-1` | open `.dat` file externally in Teddy in slot 1 |
| `open-Teddy-2` | open `.dat` file externally in Teddy in slot 2 |
| `open-Teddy-3` | open `.dat` file externally in Teddy in slot 3 |
| `open-Teddy-4` | open `.dat` file externally in Teddy in slot 4 |
| `open-SOFiPLUS` | open `.dwg` file only if exists else just open program |
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
| `open-help` | open window to choose help document; press `Enter` to open help inside atom or `Alt-Enter` to open externally; open inside atom is possible only with any PDF viewer package |
| `IFC-export` | open IFC export window |
| `IFC-import` | open IFC import window |
| `change-version` | change globally version of SOFiSTiK program without menu |
| `open-CDBASE.CHM` | open database description externally; `.chm` browser must be available in system |
| `open-SOFiPLUS` | open program |

## Tools available in `.tree-view`

The tools listed below should be called up via the Command Palette as `SOFiSTiK-tools:...`

| Tool | Description |
|-|-|
| `clean-[S]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB]` | delete files only in selected paths |
| `clean-[R]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB]` | delete files recursively from selected paths |
| `clean-[S]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE]` | delete files only in selected paths |
| `clean-[R]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE]` | delete files recursively from selected paths |
| `clean-[S]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE-CDB-PLB-BAK-SDB-DOCX-CFG-CSM]` | delete files only in selected paths |
| `clean-[R]-[ERG-PRT-LST-URS-SDB-DB2-PL-$??-#??-GRB-CDI-CDE-CDB-PLB-BAK-SDB-DOCX-CFG-CSM]` | delete files recursively from selected paths |

# Contributing

If you have ideas on how to improve the package, see bugs or want to support new features - feel free to share it via GitHub.

See my other packages for Atom & Pulsar Text Editors:

* [autocomplete-sofistik](https://github.com/bacadra/atom-autocomplete-sofistik)
* [bib-finder](https://github.com/bacadra/atom-bib-finder)
* [hydrogen-run](https://github.com/bacadra/atom-hydrogen-run)
* [image-paste](https://github.com/bacadra/atom-image-paste)
* [language-sofistik](https://github.com/bacadra/atom-language-sofistik)
* [linter-ruff](https://github.com/bacadra/atom-linter-ruff)
* [navigation-panel](https://github.com/bacadra/atom-navigation-panel)
* [open-external](https://github.com/bacadra/atom-open-external)
* [pdf-viewer](https://github.com/bacadra/atom-pdf-viewer)
* [project-files](https://github.com/bacadra/atom-project-files)
* [regex-aligner](https://github.com/bacadra/atom-regex-aligner)
* [sofistik-tools](https://github.com/bacadra/atom-sofistik-tools)
* [super-select](https://github.com/bacadra/atom-super-select)
* [word-map](https://github.com/bacadra/atom-word-map)
