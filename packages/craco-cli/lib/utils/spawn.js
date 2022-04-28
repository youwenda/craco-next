const spawn = require('cross-spawn');

function spawnPromise(command, args, options = { stdio: 'inherit' }) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    child
      .on('error', (err) => {
        reject(err);
      })
      .on('close', (code) => {
        if (code !== 0) {
          reject({
            command: `${command} ${args.join(' ')}`,
          });
          return;
        }
        resolve();
      });
  });
}

function spawnSync(command, args, options = { stdio: 'inherit' }) {
  return spawn.sync(command, args, options);
}

exports.spawnPromise = spawnPromise;
exports.spawnSync = spawnSync;
