'use babel';

import SubAtom from 'sub-atom';
import GitChangeMarkerToolbar from './git-change-marker-toolbar';
import git from './git';

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
        onRevert: () => {
          this.getLineDiffsAndHeadContent().then(({diffs, head}) => {
            let {newStart, newLines, oldStart, oldLines} = diffs.filter(({newStart, newLines}) => newStart <= row + 1 && newStart + newLines >= row + 1)[0];
            let oldContent = head.split('\n').slice(oldStart - 1, oldStart + oldLines - 1).join('\n');
            if (newLines === 0) {
              newStart++;
            }
            if (oldLines !== 0) {
              oldContent += '\n';
            }
            this.editor.setTextInBufferRange([[newStart - 1, 0], [newStart + newLines - 1, 0]], oldContent);
          });
        },
        onCompare: () => atom.notifications.addWarning("compare not implemented"),
        onCopy: () => {
          this.getLineDiffsAndHeadContent().then(({diffs, head}) => {
            let {newStart, newLines, oldStart, oldLines} = diffs.filter(({newStart, newLines}) => newStart <= row + 1 && newStart + newLines >= row + 1)[0];
            const oldContent = head.split('\n').slice(oldStart - 1, oldStart + oldLines - 1).join('\n');
            atom.clipboard.write(oldContent);
          });
        }
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

  getLineDiffsAndHeadContent() {
    const path = this.editor.getPath();
    return git.getRepoForFile(path).then(repo => {
      return Promise.all([
        repo.getLineDiffs(path, this.editor.getText()),
        git.getHeadContent(repo, path)
      ]);
    }).then(([diffs, head]) => {
      return { diffs, head }
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
