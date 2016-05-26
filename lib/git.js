'use babel';

export default git = {
  getRepoForFile(path) {
    const directory = atom.project.getDirectories().filter(d => d.contains(path))[0];
    if (!directory) {
      return Promise.reject();
    }
    return atom.project.repositoryForDirectory(directory).then(repo => repo.getRepo(path) || Promise.reject());
  },

  getLineDiff(path, text, line) {
    return git.getRepoForFile(path).then(repo => {
      const diffs = repo.getLineDiffDetails(repo.relativize(path), text).filter(diff =>
        diff.newStart <= line && diff.newStart + diff.newLines > line
        || diff.newStart === line && diff.newLines === 0);
      const oldContent = diffs.filter(diff => diff.newLineNumber === -1).map(diff => diff.line).join('');
      const {newStart, newLines, oldStart, oldLines} = diffs[0];
      return {newStart, newLines, oldStart, oldLines, oldContent};
    });
  }

};
