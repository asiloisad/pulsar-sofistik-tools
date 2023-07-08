# sofistik-tools

<p align="center">
  <a href="https://github.com/bacadra/atom-sofistik-tools/tags">
  <img src="https://img.shields.io/github/v/tag/bacadra/atom-sofistik-tools?style=for-the-badge&label=Latest&color=blue" alt="Latest">
  </a>
  <a href="https://github.com/bacadra/atom-sofistik-tools/issues">
  <img src="https://img.shields.io/github/issues-raw/bacadra/atom-sofistik-tools?style=for-the-badge&color=blue" alt="OpenIssues">
  </a>
  <a href="https://github.com/bacadra/atom-sofistik-tools/blob/master/package.json">
  <img src="https://img.shields.io/github/languages/top/bacadra/atom-sofistik-tools?style=for-the-badge&color=blue" alt="Language">
  </a>
  <a href="https://github.com/bacadra/atom-sofistik-tools/blob/master/LICENSE">
  <img src="https://img.shields.io/github/license/bacadra/atom-sofistik-tools?style=for-the-badge&color=blue" alt="Licence">
  </a>
</p>

A set of tools for cooperation with the SOFiSTiK software.

## Installation

### Atom Text Editor

The official Atom packages store has been [disabled](https://github.blog/2022-06-08-sunsetting-atom/). To get latest version run the shell command

    apm install bacadra/atom-sofistik-tools

and obtain the package directly from Github repository.

### Pulsar Text Editor

The package has compability with [Pulsar](https://pulsar-edit.dev/) and can be install

    ppm install bacadra/atom-sofistik-tools

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
| <div style="white-space:nowrap">`current-help`</div> | open help for current module in Atom in single pane |
| <div style="white-space:nowrap">`current-help-[M]`</div> | open help for current module in Atom, but multi panes |
| <div style="white-space:nowrap">`current-help-[E]`</div> | same as `current-help`, but in externally PDF viewer |
| <div style="white-space:nowrap">`calculation-WPS`</div> | open WPS with loaded `.dat` file |
| <div style="white-space:nowrap">`calculation-WPS-immediately`</div> | run calculation of file in WPS |
| <div style="white-space:nowrap">`calculation-WPS-current`</div> | run calculation of current module in WPS |
| <div style="white-space:nowrap">`calculation-SPS-immediately`</div> | run calculation of file in SPS |
| <div style="white-space:nowrap">`open-report`</div> | open `.plb` file with ReportViewer |
| <div style="white-space:nowrap">`open-report-auto-refresh`</div> | open `.plb` file with ReportViewer with flag to automatically refresh file if changed |
| <div style="white-space:nowrap">`save-report-as-PDF`</div> | convert `.plb` to `.pdf` |
| <div style="white-space:nowrap">`save-pictures-as-PDF`</div> | export images from `.plb` |
| <div style="white-space:nowrap">`open-protocol`</div> | open protocol document |
| <div style="white-space:nowrap">`open-Animator`</div> | open `.cdb` in Animator or System Visualization |
| <div style="white-space:nowrap">`open-SSD`</div> | open `.sofistik` file in SSD |
| <div style="white-space:nowrap">`open-WinGRAF`</div> | open `.gra` file with same name as `.dat` file |
| <div style="white-space:nowrap">`open-Result-Viewer`</div> | open `.result` file with same name as `.dat` file |
| <div style="white-space:nowrap">`open-Teddy`</div> | open `.dat` file externally in Teddy |
| <div style="white-space:nowrap">`open-Teddy-single`</div> | open `.dat` file externally in Teddy |
| <div style="white-space:nowrap">`open-Teddy-1`</div> | open `.dat` file externally in Teddy in slot 1 |
| <div style="white-space:nowrap">`open-Teddy-2`</div> | open `.dat` file externally in Teddy in slot 2 |
| <div style="white-space:nowrap">`open-Teddy-3`</div> | open `.dat` file externally in Teddy in slot 3 |
| <div style="white-space:nowrap">`open-Teddy-4`</div> | open `.dat` file externally in Teddy in slot 4 |
| <div style="white-space:nowrap">`open-SOFiPLUS`</div> | open `.dwg` file only if exists else just open program |
| <div style="white-space:nowrap">`export-CDB-to-DAT`</div> | open export window from `.cdb` to `.dat` |
| <div style="white-space:nowrap">`export-PLB-to-DOCX`</div> | convert `.plb` file to `.docx`; work only with SOFiSTiK 2020 or higher versions |
| <div style="white-space:nowrap">`PROG-current-toggle`</div> | toggle state of PROG of current program |
| <div style="white-space:nowrap">`PROG-all-toggle`</div> | toggle all programs |
| <div style="white-space:nowrap">`PROG-all-ON`</div> | turn ON all programs |
| <div style="white-space:nowrap">`PROG-all-OFF`</div> | turn OFF all programs |
| <div style="white-space:nowrap">`PROG-above-toggle`</div> | toggle programs above cursor |
| <div style="white-space:nowrap">`PROG-above-ON`</div> | turn ON programs above cursor |
| <div style="white-space:nowrap">`PROG-above-OFF`</div> | turn OFF programs above cursor |
| <div style="white-space:nowrap">`PROG-below-toggle`</div> | toggle programs below cursor |
| <div style="white-space:nowrap">`PROG-below-ON`</div> | turn ON programs below cursor |
| <div style="white-space:nowrap">`PROG-below-OFF`</div> | turn OFF programs below cursor |
| <div style="white-space:nowrap">`clear-URS-tags`</div> | delete all urs tags |

## Tools available in `atom-workspace`

The tools listed below should be called up via the Command Palette as `SOFiSTiK-tools:...`

| Tool | Description |
|-|-|
| <div style="white-space:nowrap">`open-help`</div> | open window to choose help document; press `Enter` to open help inside atom or `Alt-Enter` to open externally; open inside atom is possible only with any PDF viewer package |
| <div style="white-space:nowrap">`IFC-export`</div> | open IFC export window |
| <div style="white-space:nowrap">`IFC-import`</div> | open IFC import window |
| <div style="white-space:nowrap">`change-version`</div> | change globally version of SOFiSTiK program without menu |
| <div style="white-space:nowrap">`open-CDBASE.CHM`</div> | open database description externally; `.chm` browser must be available in system |
| <div style="white-space:nowrap">`open-SOFiPLUS`</div> | open program |

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

# Contributing [🍺](https://www.buymeacoffee.com/asiloisad)

If you have ideas on how to improve the package, see bugs or want to support new features - feel free to share it via GitHub.

See my other packages for Atom & Pulsar Text Editors:
<p align="center">
<a href="https://github.com/bacadra/atom-autocomplete-sofistik"><img src="https://img.shields.io/github/v/tag/bacadra/atom-autocomplete-sofistik?style=for-the-badge&label=autocomplete-sofistik&color=blue" alt="autocomplete-sofistik">
<a href="https://github.com/bacadra/atom-bib-finder"><img src="https://img.shields.io/github/v/tag/bacadra/atom-bib-finder?style=for-the-badge&label=bib-finder&color=blue" alt="bib-finder">
<a href="https://github.com/bacadra/atom-hydrogen-run"><img src="https://img.shields.io/github/v/tag/bacadra/atom-hydrogen-run?style=for-the-badge&label=hydrogen-run&color=blue" alt="hydrogen-run">
<a href="https://github.com/bacadra/atom-image-paste"><img src="https://img.shields.io/github/v/tag/bacadra/atom-image-paste?style=for-the-badge&label=image-paste&color=blue" alt="image-paste">
<a href="https://github.com/bacadra/atom-language-latex"><img src="https://img.shields.io/github/v/tag/bacadra/atom-language-latex?style=for-the-badge&label=language-latex&color=blue" alt="language-latex">
<a href="https://github.com/bacadra/atom-language-sofistik"><img src="https://img.shields.io/github/v/tag/bacadra/atom-language-sofistik?style=for-the-badge&label=language-sofistik&color=blue" alt="language-sofistik">
<a href="https://github.com/bacadra/atom-language-tasklist"><img src="https://img.shields.io/github/v/tag/bacadra/atom-language-tasklist?style=for-the-badge&label=language-tasklist&color=blue" alt="language-tasklist">
<a href="https://github.com/bacadra/atom-linter-ruff"><img src="https://img.shields.io/github/v/tag/bacadra/atom-linter-ruff?style=for-the-badge&label=linter-ruff&color=blue" alt="linter-ruff">
<a href="https://github.com/bacadra/atom-linter-sofistik"><img src="https://img.shields.io/github/v/tag/bacadra/atom-linter-sofistik?style=for-the-badge&label=linter-sofistik&color=blue" alt="linter-sofistik">
<a href="https://github.com/bacadra/atom-navigation-panel"><img src="https://img.shields.io/github/v/tag/bacadra/atom-navigation-panel?style=for-the-badge&label=navigation-panel&color=blue" alt="navigation-panel">
<a href="https://github.com/bacadra/atom-open-external"><img src="https://img.shields.io/github/v/tag/bacadra/atom-open-external?style=for-the-badge&label=open-external&color=blue" alt="open-external">
<a href="https://github.com/bacadra/atom-pdf-viewer"><img src="https://img.shields.io/github/v/tag/bacadra/atom-pdf-viewer?style=for-the-badge&label=pdf-viewer&color=blue" alt="pdf-viewer">
<a href="https://github.com/bacadra/atom-project-files"><img src="https://img.shields.io/github/v/tag/bacadra/atom-project-files?style=for-the-badge&label=project-files&color=blue" alt="project-files">
<a href="https://github.com/bacadra/atom-regex-aligner"><img src="https://img.shields.io/github/v/tag/bacadra/atom-regex-aligner?style=for-the-badge&label=regex-aligner&color=blue" alt="regex-aligner">
<a href="https://github.com/bacadra/atom-sofistik-tools"><img src="https://img.shields.io/github/v/tag/bacadra/atom-sofistik-tools?style=for-the-badge&label=sofistik-tools&color=blue" alt="sofistik-tools">
<a href="https://github.com/bacadra/atom-super-select"><img src="https://img.shields.io/github/v/tag/bacadra/atom-super-select?style=for-the-badge&label=super-select&color=blue" alt="super-select">
<a href="https://github.com/bacadra/atom-tasklist-tools"><img src="https://img.shields.io/github/v/tag/bacadra/atom-tasklist-tools?style=for-the-badge&label=tasklist-tools&color=blue" alt="tasklist-tools">
<a href="https://github.com/bacadra/atom-word-map"><img src="https://img.shields.io/github/v/tag/bacadra/atom-word-map?style=for-the-badge&label=word-map&color=blue" alt="word-map">
</p>
