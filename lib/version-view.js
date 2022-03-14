'use babel'

import { TextEditor } from 'atom';

export default class VersionView {

    constructor(state) {
        this.paneItem = null;

        this.miniEditor = new TextEditor({ mini: true });
        this.miniEditor.element.addEventListener('blur', this.close.bind(this));
        this.miniEditor.setPlaceholderText('Enter SOFiSTiK version');

        this.message = document.createElement('div');
        this.message.classList.add('dialog');
        this.message.classList.add('version-view-dialog');

        this.element = document.createElement('div');
        this.element.classList.add('man');
        this.element.appendChild(this.miniEditor.element);
        this.element.appendChild(this.message);

        this.panel = atom.workspace.addModalPanel({
            item: this,
            visible: false,
        });

        atom.commands.add(this.miniEditor.element, 'core:confirm', () => {
            this.confirm();
        });
        atom.commands.add(this.miniEditor.element, 'core:cancel', () => {
            this.close();
        });
    }

    close() {
        if (! this.panel.isVisible()) return;
        this.miniEditor.setText('');
        this.panel.hide();
        if (this.miniEditor.element.hasFocus()) {
            this.restoreFocus();
        }
    }

    confirm() {
        const version = this.miniEditor.getText();
        this.close();
        atom.config.set('sofistik-tools.version', version)
    }

    storeFocusedElement() {
        this.previouslyFocusedElement = document.activeElement;
        return this.previouslyFocusedElement;
    }

    restoreFocus() {
        if (this.previouslyFocusedElement && this.previouslyFocusedElement.parentElement) {
            return this.previouslyFocusedElement.focus();
        }
        atom.views.getView(atom.workspace).focus();
    }

    open() {
        if (this.panel.isVisible()) return;
        this.storeFocusedElement();
        this.panel.show();
        this.message.textContent = 'Enter SOFiSTiK version as "2022", "2020" or "2018"';
        this.miniEditor.element.focus();
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    setCurrentWord(w) {
        this.miniEditor.setText(w);
        this.miniEditor.selectAll();
    }

}
