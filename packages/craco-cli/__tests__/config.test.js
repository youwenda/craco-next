require('../lib/utils/setEnv');
require('../lib/utils/setNpm');
const webpackConfig = require('react-scripts/config/webpack.config');
const devServerConfig = require('react-scripts/config/webpackDevServer.config');
const getConfig = require('../lib/utils/getConfig');
const { traverse } = require('customize-cra-extra/__tests__/config');

describe('start', () => {
  test('test production getConfig', () => {
    process.env.NODE_ENV = 'production';
    expect(
      traverse(getConfig().webpack(webpackConfig(process.env.NODE_ENV), process.env.NODE_ENV))
    ).toMatchSnapshot();
  });
  test('test development getConfig', () => {
    process.env.NODE_ENV = 'development';
    process.env.USE_STYLE_LOADER = 'true';
    expect(
      traverse(
        getConfig().webpack(webpackConfig(process.env.NODE_ENV), process.env.NODE_ENV).module.rules
      )
    ).toMatchSnapshot();
  });
  test('test development devServer', () => {
    process.env.NODE_ENV = 'development';
    expect(
      traverse(getConfig().devServer(devServerConfig, process.env.NODE_ENV)())
    ).toMatchSnapshot();
  });
});
