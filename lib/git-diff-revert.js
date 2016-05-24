'use babel';

import GitDiffRevertView from './git-diff-revert-view';
import { CompositeDisposable } from 'atom';

export default {

  gitDiffRevertView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.gitDiffRevertView = new GitDiffRevertView(state.gitDiffRevertViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.gitDiffRevertView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'git-diff-revert:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.gitDiffRevertView.destroy();
  },

  serialize() {
    return {
      gitDiffRevertViewState: this.gitDiffRevertView.serialize()
    };
  },

  toggle() {
    console.log('GitDiffRevert was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
