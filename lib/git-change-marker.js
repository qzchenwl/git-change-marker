'use babel';

import GitChangeMarkerView from './git-change-marker-view';

export default {
  config: {
    gitPath: {
      type: 'string',
      default: 'git',
      description: 'Where is your git?'
    }
  },

  activate(state) {
    atom.workspace.observeTextEditors(editor => new GitChangeMarkerView(editor));
  },

};
