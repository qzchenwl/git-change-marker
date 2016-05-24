'use babel';

import SubAtom from 'sub-atom';
import GitChangeMarkerToolbar from './git-change-marker-toolbar';

export default class GitChangeMarkerView {

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

      this.marker && this.marker.destroy();
      this.marker = this.editor.markBufferRange([[row, 1], [row, 1]], {invalidate: 'never'});

      const toolbar = new GitChangeMarkerToolbar({
        onPreviousChange: () => this.moveToPreviousChange(),
        onNextChange: () => this.moveToNextChange(),
        onRevert: () => atom.notifications.addWarning("revert not implemented"),
        onCompare: () => atom.notifications.addWarning("compare not implemented"),
        onCopy: () => atom.notifications.addWarning("copy not implemented")
      });

      const destroyDecoration = () => {
        this.marker.destroy();
        document.removeEventListener('mousedown', destroyDecoration);
      }
      document.addEventListener('mousedown', destroyDecoration);

      toolbar.on('click', destroyDecoration);
      toolbar.on('mousedown', e => e.stopPropagation());

      editor.decorateMarker(this.marker, {type: 'overlay', item: toolbar});
    });
  }

  moveToNextChange() {
    const editorView = atom.views.getView(this.editor);
    atom.commands.dispatch(editorView, 'git-diff:move-to-next-diff');
  }

  moveToPreviousChange() {
    const editorView = atom.views.getView(this.editor);
    /* FIXME: dirty hack */
    atom.commands.dispatch(editorView, 'git-diff:move-to-previous-diff');
    atom.commands.dispatch(editorView, 'git-diff:move-to-previous-diff');
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.subscriptions.dispose();
  }
}
