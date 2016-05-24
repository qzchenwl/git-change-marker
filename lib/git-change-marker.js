'use babel';

import GitChangeMarkerView from './git-change-marker-view';

export default {

  activate(state) {
    console.log('activate git-change-marker');
    atom.workspace.observeTextEditors(editor => new GitChangeMarkerView(editor));
  },

};
