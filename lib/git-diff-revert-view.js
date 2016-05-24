'use babel';

import SubAtom from 'sub-atom';
import ControlView from './control-view';

export default class GitDiffRevertView {

  constructor(editor) {
    this.subscriptions = new SubAtom();
    this.editor = editor;
    this.gutter = this.editor.gutterWithName('line-number');

    const editorView = atom.views.getView(this.editor);
    const gutterView = atom.views.getView(this.gutter);

    this.subscriptions.add(gutterView, 'click', '.git-line-added, .git-line-removed, .git-line-modified', e => {
      const row = parseInt(e.target.dataset.bufferRow);
      if (isNaN(row)) {
        return;
      }
      console.log('git-line', row);
      this.marker && this.marker.destroy();
      this.marker = this.editor.markBufferRange([[row, 1], [row, 1]], {invalidate: 'never'});
      console.log(this.marker);

      const element = new ControlView({message: 'hi'});
      const destroyDecoration = () => {
        this.marker.destroy();
        document.removeEventListener('mousedown', destroyDecoration);
      }
      document.addEventListener('mousedown', destroyDecoration);
      editor.decorateMarker(this.marker, {type: 'overlay', item: element});
    });
  }

  moveToNextDiff() {
    const editorView = atom.views.getView(this.editor);
    atom.commands.dispatch(editorView, 'git-diff:move-to-next-diff');
  }

  moveToPreviousDiff() {
    const editorView = atom.views.getView(this.editor);
    atom.commands.dispatch(editorView, 'git-diff:move-to-previous-diff');
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.subscriptions.dispose();
  }
}
