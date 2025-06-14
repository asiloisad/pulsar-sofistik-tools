# sofistik-tools

A superset of commands to improve SOFiSTiK workflow. A grammar supply package is required, e.g. [language-sofistik](https://github.com/asiloisad/pulsar-language-sofistik).

## Installation

To install `sofistik-tools` search for [sofistik-tools](https://web.pulsar-edit.dev/packages/sofistik-tools) in the Install pane of the Pulsar settings or run `ppm install sofistik-tools`. Alternatively, you can run `ppm install asiloisad/pulsar-sofistik-tools` to install a package directly from the GitHub repository.

## Compatibility

Support versions of SOFiSTiK are 2025, 2024, 2023, 2022, 2020 and 2018. English only.

## Configuration

The most important part is to correctly set the software installation path and the SOFiSTiK version. You can do it in package settings. The package support shebang as regex `^@ SOFiSTiK (\d{4})(-\d\d?)?$`, e.g. `@ SOFiSTiK 2022`, `@ SOFiSTiK 2018`, `@ SOFiSTiK 2018-12`. This overwrite global package settings for all commands run from text-editor scope.

## Help view

The help view can be opened in any internal or external PDF viewers. If [pdf-viewer](https://github.com/asiloisad/pulsar-pdf-viewer) is used, then help PDF file can be scrolled to current keyword. A package [language-sofistik](https://github.com/asiloisad/pulsar-language-sofistik) is required. A help-list can used named destination (e.g. `ase:grp2`).

## Commands in `source.sofistik` (e.g. `.dat` file)

Command | Description
|-|-|
`.current-help` | open help for current module in Pulsar in single pane
`.current-help-[M]` | open help for current module in Pulsar, but multi panes
`.current-help-[E]` | same as `current-help`, but in externally PDF viewer
`.calculation-WPS` | open WPS with loaded `.dat` file
`.calculation-WPS-immediately` | run calculation of file in WPS
`.calculation-WPS-current` | run calculation of current module in WPS
`.calculation-SPS-immediately` | run calculation of file in SPS
`.open-report` | open `.plb` file with ReportViewer
`.save-report-as-PDF` | convert `.plb` to `.pdf`
`.save-pictures-as-PDF` | export images from `.plb`
`.open-protocol` | open protocol document
`.open-Animator` | open `.cdb` in Animator or System Visualization
`.open-SSD` | open `.sofistik` file in SSD
`.open-WinGRAF` | open `.gra` file with same name as `.dat` file
`.open-Result-Viewer` | open `.result` file with same name as `.dat` file
`.open-Teddy` | open `.dat` file externally in Teddy
`.open-Teddy-single` | open `.dat` file externally in Teddy
`.open-Teddy-1` | open `.dat` file externally in Teddy in slot 1
`.open-Teddy-2` | open `.dat` file externally in Teddy in slot 2
`.open-Teddy-3` | open `.dat` file externally in Teddy in slot 3
`.open-Teddy-4` | open `.dat` file externally in Teddy in slot 4
`.open-SOFiPLUS` | open `.dwg` file only if exists else just open program
`.export-CDB-to-DAT` | open export window from `.cdb` to `.dat`
`.export-PLB-to-DOCX` | convert `.plb` file to `.docx`; work with SOFiSTiK 2020 or higher versions only
`.progam-current-toggle` | toggle state of progam of current program
`.progam-all-toggle` | toggle all programs
`.progam-all-ON` | turn ON all programs
`.progam-all-OFF` | turn OFF all programs
`.progam-above-toggle` | toggle programs above cursor
`.progam-above-ON` | turn ON programs above cursor
`.progam-above-OFF` | turn OFF programs above cursor
`.progam-below-toggle` | toggle programs below cursor
`.progam-below-ON` | turn ON programs below cursor
`.progam-below-OFF` | turn OFF programs below cursor
`.clear-URS-tags` | delete all urs tags

## Commands in `atom-workspace`

Command | Description
|-|-|
`.open-help` | open window to choose help document
`.IFC-export` | open IFC export window
`.IFC-import` | open IFC import window
`.change-version` | change globally version of SOFiSTiK program without menu
`.open-CDBASE.CHM` | open database description externally
`.open-SOFiPLUS` | open program

## Commands in `.tree-view`

Command | Description
|-|-|
`.clean-1` | delete files `.erg`, `.prt`, `.lst`, `.urs`, `.sdb`, `.db-2`, `.pl`, `.$*`, `.#*`, `.grb`, `.err`, `.error_positions`, `.dwl`, `.dwl2`, `.cfg`
`.clean-2` | delete files like `1` and `.cdi`, `.cde`
`.clean-3` | delete files like `2` and `.cdb`, `.sqlite`
`.clean-4` | delete files like `3` and `.plb`, `.bak`, `_csm.dat`, `_csmlf.dat`

# Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback’s welcome!
