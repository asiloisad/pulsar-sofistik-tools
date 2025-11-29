# sofistik-tools

A superset of commands to improve SOFiSTiK workflow. A grammar supply package is required, e.g. [language-sofistik](https://github.com/asiloisad/pulsar-language-sofistik).

## Installation

To install `sofistik-tools` search for [sofistik-tools](https://web.pulsar-edit.dev/packages/sofistik-tools) in the Install pane of the Pulsar settings or run `ppm install sofistik-tools`. Alternatively, you can run `ppm install asiloisad/pulsar-sofistik-tools` to install a package directly from the GitHub repository.

## Configuration

| Setting | Description |
|-|-|
| SOFiSTiK installation path | Path to the SOFiSTiK installation folder (default: `C:\Program Files\SOFiSTiK`) |
| Enable keystroke hints | Show info message with keystroke hints in selection lists |

## Version Resolution

The package determines which SOFiSTiK version to use in the following priority order:

1. **Shebang in file**: `@ SOFiSTiK 2026` or `@ SOFiSTiK 2024-05` comment in the file (searched backwards from cursor)
2. **Project configuration**: `sofistik.def` file in the same directory with `SOF_VERSION = 2026`
3. **Package setting**: Version configured in [language-sofistik](https://github.com/asiloisad/pulsar-language-sofistik) settings

## Features

### Help System

The help view opens PDF manuals directly in Pulsar using [pdf-viewer](https://github.com/asiloisad/pulsar-pdf-viewer). When cursor is on a command, it jumps to that command's documentation.

### File Handlers

The package registers handlers for SOFiSTiK file types. Double-clicking these files in tree-view opens them in the appropriate application:

| Extension | Application |
|-|-|
| `.cdb` | Animator |
| `.plb` | Report Viewer |
| `.gra` | WinGRAF |
| `.results` | Result Viewer |
| `.sofistik` | SSD |
| `.dwg` | SOFiPLUS (if `sofistik.def` exists) |

### Child Files

Use `@ child:filename.dat` directive to run multiple files in sequence. Use `@ only-children` to skip the parent file itself.

## Commands in `source.sofistik` scope

Commands available when editing `.dat` files:

| Command | Description |
|-|-|
| `current-help` | Open help for current module in PDF viewer (reuses pane) |
| `separately-help` | Open help for current module in new pane |
| `calculation-wps` | Open WPS with current file |
| `calculation-wps-immediately` | Run calculation in WPS |
| `calculation-wps-current` | Run calculation of current program only |
| `calculation-sps-immediately` | Run calculation in SPS |
| `open-report` | Open `.plb` file in Report Viewer |
| `save-report-as-pdf` | Export report to PDF |
| `save-pictures-as-pdf` | Export pictures from report to PDF |
| `open-protocol` | Open `.prt` protocol file in editor |
| `open-animator` | Open `.cdb` in Animator |
| `open-animator-2018` | Open `.cdb` in Animator 2018 |
| `open-viewer` | Open `.cdb` in Viewer (2024+) or FEA Viewer (2020-2023) |
| `open-dbinfo` | Open `.cdb` in Database Info |
| `open-ssd` | Open `.sofistik` file in SSD |
| `open-wingraf` | Open `.gra` file in WinGRAF |
| `open-result-viewer` | Open `.results` file in Result Viewer |
| `open-teddy` | Open file in Teddy |
| `open-teddy-single` | Open file in Teddy (single instance) |
| `open-teddy-1` | Open file in Teddy slot 1 |
| `open-teddy-2` | Open file in Teddy slot 2 |
| `open-teddy-3` | Open file in Teddy slot 3 |
| `open-teddy-4` | Open file in Teddy slot 4 |
| `open-sofiplus` | Open `.dwg` file in SOFiPLUS |
| `export-cdb` | Open CDB export dialog |
| `export-plb-to-docx` | Convert `.plb` to `.docx` (2020+) |
| `progam-current-toggle` | Toggle current program on/off |
| `progam-all-toggle` | Toggle all programs |
| `progam-all-on` | Turn ON all programs |
| `progam-all-off` | Turn OFF all programs |
| `progam-above-toggle` | Toggle programs above cursor |
| `progam-above-on` | Turn ON programs above cursor |
| `progam-above-off` | Turn OFF programs above cursor |
| `progam-below-toggle` | Toggle programs below cursor |
| `progam-below-on` | Turn ON programs below cursor |
| `progam-below-off` | Turn OFF programs below cursor |
| `clear-urs-tags` | Remove all URS tags from programs |

## Commands in `atom-workspace` scope

| Command | Description |
|-|-|
| `ifc-export` | Open IFC export dialog |
| `ifc-import` | Open IFC import dialog |
| `open-cdbase.chm` | Open database description (CDBASE.CHM) |

## Commands in `.tree-view` scope

Commands available when right-clicking in tree view:

### File Operations

| Command | Description |
|-|-|
| `open-animator` | Open selected `.cdb` in Animator |
| `open-animator-2018` | Open selected `.cdb` in Animator 2018 |
| `open-report` | Open selected `.plb` in Report Viewer |
| `save-report-as-pdf` | Export selected report to PDF |
| `save-pictures-as-pdf` | Export pictures from selected report |
| `open-protocol` | Open selected `.prt` file |
| `open-viewer` | Open selected `.cdb` in Viewer |
| `open-viewer-2025` | Open selected `.cdb` in Viewer 2025 |
| `open-dbinfo` | Open selected `.cdb` in Database Info |
| `open-ssd` | Open selected `.sofistik` in SSD |
| `open-wingraf` | Open selected `.gra` in WinGRAF |
| `open-result-viewer` | Open selected `.results` in Result Viewer |
| `open-teddy` | Open selected file in Teddy |
| `open-teddy-single` | Open in Teddy (single instance) |
| `open-teddy-1` to `open-teddy-4` | Open in Teddy slot 1-4 |
| `open-sofiplus` | Open selected `.dwg` in SOFiPLUS |
| `export-cdb` | Open CDB export for selected file |

### Clean Commands

Delete temporary and output files from selected folders:

| Command | Files Deleted |
|-|-|
| `clean-1` | `.erg` `.prt` `.lst` `.urs` `.sdb` `.db-2` `.pl` `.$*` `.#*` `.grb` `.err` `.error_positions` `.dwl` `.dwl2` `.cfg` |
| `clean-2` | Above + `.cdi` `.cde` |
| `clean-3` | Above + `.cdb` `.sqlite` |
| `clean-4` | Above + `.plb` `.bak` `_csm.dat` `_csmlf.dat` |
| `clean-glob` | Custom glob pattern |

Add `-recursively` suffix to clean subdirectories (e.g., `clean-1-recursively`).

### WinGRAF Fix

| Command | Description |
|-|-|
| `wing-fix` | Fix MSCA issues in `.gra` files |
| `wing-fix-recursively` | Fix MSCA issues recursively |

# Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback's welcome!
