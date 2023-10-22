# sofistik-tools

<p align="center">
  <a href="https://github.com/bacadra/pulsar-sofistik-tools/tags">
  <img src="https://img.shields.io/github/v/tag/bacadra/pulsar-sofistik-tools?style=for-the-badge&label=Latest&color=blue" alt="Latest">
  </a>
  <a href="https://github.com/bacadra/pulsar-sofistik-tools/issues">
  <img src="https://img.shields.io/github/issues-raw/bacadra/pulsar-sofistik-tools?style=for-the-badge&color=blue" alt="OpenIssues">
  </a>
  <a href="https://github.com/bacadra/pulsar-sofistik-tools/blob/master/package.json">
  <img src="https://img.shields.io/github/languages/top/bacadra/pulsar-sofistik-tools?style=for-the-badge&color=blue" alt="Language">
  </a>
  <a href="https://github.com/bacadra/pulsar-sofistik-tools/blob/master/LICENSE">
  <img src="https://img.shields.io/github/license/bacadra/pulsar-sofistik-tools?style=for-the-badge&color=blue" alt="Licence">
  </a>
</p>

A set of tools for cooperation with the SOFiSTiK software.

## Installation

To install `sofistik-tools` search for [sofistik-tools](https://web.pulsar-edit.dev/packages/sofistik-tools) in the Install pane of the Pulsar settings or run `ppm install sofistik-tools`.

Alternatively, run `ppm install bacadra/pulsar-sofistik-tools` to install a package directly from Github repository.

## Compatibility

**Support versions of SOFiSTiK are 2023, 2022, 2020 and 2018. English only.** As the package supports many versions of SOFiSTiK, the package hints may become invalid for certain versions due to changing commands and features.

## Configuration

The most important part is to correctly set the software installation path and the SOFiSTiK version. You can do it in package settings.

The package support shebang as regex `^@ SOFiSTiK (\d{4})(-\d\d?)?$`, e.g. `@ SOFiSTiK 2022`, `@ SOFiSTiK 2018`, `@ SOFiSTiK 2018-12`. This overwrite global package settings.

## Help view

The help view can be opened in any internal or external PDF viewers. If [pdf-viewer](https://github.com/bacadra/pulsar-pdf-viewer) is used, then help PDF file can be scrolled to current keyword.

## Tools available in `source.sofistik` (e.g. `.dat` file)

The tools listed below should be called up via the Command Palette as `SOFiSTiK-tools:...`

| Tool | Description |
|-|-|
| <div style="white-space:nowrap">`current-help`</div> | open help for current module in Pulsar in single pane |
| <div style="white-space:nowrap">`current-help-[M]`</div> | open help for current module in Pulsar, but multi panes |
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
| <div style="white-space:nowrap">`open-help`</div> | open window to choose help document; press `Enter` to open help inside Pulsar or `Alt-Enter` to open externally; open inside Pulsar is possible only with any PDF viewer package |
| <div style="white-space:nowrap">`IFC-export`</div> | open IFC export window |
| <div style="white-space:nowrap">`IFC-import`</div> | open IFC import window |
| <div style="white-space:nowrap">`change-version`</div> | change globally version of SOFiSTiK program without menu |
| <div style="white-space:nowrap">`version-2018`</div> | change default version to 2018 |
| <div style="white-space:nowrap">`version-2020`</div> | change default version to 2020 |
| <div style="white-space:nowrap">`version-2022`</div> | change default version to 2022 |
| <div style="white-space:nowrap">`version-2023`</div> | change default version to 2023 |
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

If you have any ideas on how to improve the package, spot any bugs, or would like to support the development of new features, please feel free to share them via GitHub.
