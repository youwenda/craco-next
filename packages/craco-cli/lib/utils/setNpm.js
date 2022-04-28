const TerserPlugin = require('terser-webpack-plugin');

require('react-dev-utils/clearConsole');
require.cache[require.resolve('react-dev-utils/clearConsole')].exports = function clearConsole() {
  const { CLEAR_CONSOLE = 'false' } = process.env;
  if (CLEAR_CONSOLE !== 'false') {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
  }
};

// 初次启动时检测存在可能的接口时间会很长
// require('react-dev-utils/getProcessForPort');
// require.cache[require.resolve('react-dev-utils/getProcessForPort')].exports =
//   function getProcessForPort() {};

const { createCompiler } = require('react-dev-utils/WebpackDevServerUtils');
const { TS_CHECKER } = process.env;
if (!TS_CHECKER || TS_CHECKER === 'false') {
  // 强制不处理typescript
  require.cache[require.resolve('react-dev-utils/WebpackDevServerUtils')].exports.createCompiler = (
    options = {}
  ) => {
    return createCompiler({
      ...options,
      useTypeScript: false,
    });
  };
}

const verifyTypeScriptSetup = require('react-scripts/scripts/utils/verifyTypeScriptSetup');
require.cache[require.resolve('react-scripts/scripts/utils/verifyTypeScriptSetup')].exports =
  function () {
    const { TS_AUTO_SETUP = 'true' } = process.env;
    if (TS_AUTO_SETUP !== 'true') {
      return;
    }
    verifyTypeScriptSetup();
  };

require.cache[
  require.resolve('terser-webpack-plugin')
].exports = class TerserPluginOverridden extends TerserPlugin {
  constructor(options) {
    options.extractComments = false;
    super(options);
  }
};

const origOpenBrowser = require('react-dev-utils/openBrowser');
require.cache[require.resolve('react-dev-utils/openBrowser')].exports = function openBrowser(
  ...args
) {
  const { AUTO_OPEN_BROWSER = 'false' } = process.env;
  if (AUTO_OPEN_BROWSER !== 'false') {
    return origOpenBrowser(...args);
  } else {
    process.env.AUTO_OPEN_BROWSER_URL = args[0];
  }
};
