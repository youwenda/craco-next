process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const fs = require('fs');
const path = require('path');
const paths = require('react-scripts/config/paths');

const setEnv = require('../utils/setEnv');
const getConfig = require('../utils/getConfig');

// 检测是否含有dll资源，如果没有初次启动执行
function runDll() {
  if (process.env.NO_VENDORS_DLL === 'true' || process.env.DISABLE_VENDORS_DLL === 'true') {
    return;
  }

  const vendorsPath = path.resolve(paths.appPublic, 'vendors');
  if (
    !fs.existsSync(path.resolve(vendorsPath, './vendors.dll.js')) ||
    !fs.existsSync(path.resolve(vendorsPath, './vendors-manifest.json')) ||
    !fs.existsSync(path.resolve(vendorsPath, './vendors.dll.js.map'))
  ) {
    return require('./dll')();
  }
}

require('../utils/setNpm');

module.exports = async () => {
  // 兼容 .rmxrc env
  setEnv();

  const config = getConfig();

  // override paths in memory
  require.cache[require.resolve('react-scripts/config/paths')].exports = config.paths(
    paths,
    process.env.NODE_ENV
  );

  // fix: webpack.config文件中依赖config/paths，所以需要重新设置paths之后在进行require操作。
  const webpackConfig = require('react-scripts/config/webpack.config');
  const devServerConfig = require('react-scripts/config/webpackDevServer.config');
  // override config in memory
  require.cache[require.resolve('react-scripts/config/webpack.config')].exports = (env) =>
    config.webpack(webpackConfig(env), env);
  require.cache[require.resolve('react-scripts/config/webpackDevServer.config')].exports =
    config.devServer(devServerConfig, process.env.NODE_ENV);

  await runDll();
  // run original script
  require('react-scripts/scripts/start');
};
