const { spawnSync } = require('../utils/spawn');

module.exports = async () => {
  spawnSync('node', [require.resolve('react-scripts/scripts/test.js')], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
};
