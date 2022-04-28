const httpsReg = /^(?:https?:)?\/\//;

// 设置默认值
Object.assign(process.env, {
  // disable create inline runtime chunk
  INLINE_RUNTIME_CHUNK: 'false',
  // disable eslint plugin
  DISABLE_ESLINT_PLUGIN: 'true',
  // disable node polyfills
  DISABLE_NODE_POLYFILLS: 'false',
  // enable generate sourceMap
  GENERATE_SOURCEMAP: 'true',
  // disable clear console
  CLEAR_CONSOLE: 'false',
  // disable forkTs
  TS_CHECKER: 'false',
  // disable tsc
  TS_COMPILER: 'false',
  // disable verifyTypeScriptSetup
  TS_AUTO_SETUP: 'false',
  // disable auto opening browsers
  BROWSER: 'none',
  // disable auto opening browsers，Isomorphism from BROWSER=none
  AUTO_OPEN_BROWSER: 'false',
});

// 兼容 .rmxrc env 之前，需要同步react-scripts的env逻辑
require('react-scripts/config/env');

function setEnv() {
  // 订正可能存在异常数据设置HOST
  if (typeof process.env.HOST === 'string') {
    process.env.HOST = process.env.HOST.replace(httpsReg, '');
  }
}

module.exports = setEnv;
