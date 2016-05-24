'use babel';

import GitDiffRevertView from './git-diff-revert-view';

export default {

  activate(state) {
    console.log('activate git-diff-revert');
    atom.workspace.observeTextEditors(editor => new GitDiffRevertView(editor));
  },

};
