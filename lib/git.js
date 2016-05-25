'use babel';

import {BufferedProcess} from 'atom';

export default git = {
  cmd(args, options) {
    return new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      let code = 0;
      try {
        new BufferedProcess({
          command: 'git',
          args: args,
          options: options,
          stdout: data => stdout += data.toString(),
          stderr: data => stderr += data.toString(),
          exit: code => code === 0 ? resolve({code, stdout, stderr}) : reject({code, stdout, stderr})
        });
      } catch(e) {
        reject('Could\'t find git');
      }
    });
  },

  getHeadContent(repo, path) {
    return git.cmd(['show', 'HEAD:' + repo.relativize(path)], {cwd: repo.getWorkingDirectory()}).then(v => v.stdout)
  },

  getRepoForFile(path) {
    const directory = atom.project.getDirectories().filter(d => d.contains(path))[0];
    if (!directory) {
      return Promise.reject();
    }
    return atom.project.repositoryForDirectory(directory).then(repo => repo || Promise.reject());
  }
  
};
