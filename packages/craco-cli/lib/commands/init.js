const { spawnSync } = require('../utils/spawn');
module.exports = async () => {
  spawnSync('npm', ['create', 'taojimu-miniapp']);
};
