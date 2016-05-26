'use babel';

import GitChangeMarkerView from './git-change-marker-view';

export default {
  
  activate(state) {
    atom.workspace.observeTextEditors(editor => new GitChangeMarkerView(editor));
  },

};
