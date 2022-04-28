const path = require('path');
const webpackConfig = require('react-scripts/config/webpack.config');
const toString = Object.prototype.toString;
const rootReg = new RegExp(path.resolve(__dirname, '../../../'));
const traverse = (config) => {
  if (typeof config === 'string') {
    if (rootReg.test(config)) {
      config = `craco-next${config.replace(rootReg, '')}`;
    }
  } else if (toString.call(config) === '[object Object]') {
    Object.keys(config).forEach((k) => {
      config[k] = traverse(config[k]);
    });
  } else if (Array.isArray(config)) {
    config.forEach((v, i) => {
      config[i] = traverse(config[i]);
    });
  }
  return config;
};
const getConfig = (env = 'development') => {
  let config = webpackConfig(env);
  config = traverse(config);
  return config;
};
module.exports = {
  getConfig,
  traverse,
};
