require('../../craco-cli/lib/utils/setEnv');
require('../../craco-cli/lib/utils/setNpm');
const { addLoaders } = require('../lib');
const { removePlugin } = require('../lib');
const { cleanPlugin } = require('../lib');
const { addPlugins } = require('../lib');
const {
  addBabelIncludes,
  getBabelLoader,
  removeInternalBabelPlugin,
  addSourceMapLoader,
} = require('../lib');
const { getConfig } = require('./config');

const ForkTsCheckerWebpackPlugin =
  process.env.TSC_COMPILE_ON_ERROR === 'true'
    ? require('react-dev-utils/ForkTsCheckerWarningWebpackPlugin')
    : require('react-dev-utils/ForkTsCheckerWebpackPlugin');

describe('addBabelIncludes', () => {
  test('add string in src babel', () => {
    const developmentConfig = getConfig();
    expect(getBabelLoader(addBabelIncludes('lib')(developmentConfig))).toMatchSnapshot();
  });
  test('add array in src babel', () => {
    const developmentConfig = getConfig();
    expect(getBabelLoader(addBabelIncludes(['lib', 'lib2'])(developmentConfig))).toMatchSnapshot();
  });
  test('add array in node_modules babel', () => {
    const developmentConfig = getConfig();
    expect(
      getBabelLoader(addBabelIncludes(['lib', 'lib2'], true)(developmentConfig), true)
    ).toMatchSnapshot();
  });
});

describe('removeInternalBabelPlugin', () => {
  test('remove react-refresh', () => {
    const developmentConfig = getConfig();
    expect(
      getBabelLoader(removeInternalBabelPlugin('react-refresh')(developmentConfig))
    ).toMatchSnapshot();
  });
});

describe('addLoaders', () => {
  test("addLoaders [{test:'.jsx',loader: 'babel-loader'}, {test: 'jsx2', use: [{ loader: 'babel-loader' }]}]", () => {
    const developmentConfig = getConfig();
    expect(
      addLoaders([
        { test: '.jsx', loader: 'babel-loader' },
        { test: 'jsx2', use: [{ loader: 'babel-loader' }] },
      ])(developmentConfig).module.rules[1].oneOf.slice(-3)
    ).toMatchSnapshot();
  });
});

describe('addPlugins', () => {
  test('add one plugin', () => {
    const developmentConfig = getConfig();
    const plugin = function Plugin() {};
    expect(addPlugins([new plugin()])(developmentConfig).plugins).toMatchSnapshot();
  });
});

describe('removelugins', () => {
  test('remove ESLintWebpackPlugin plugin', () => {
    const developmentConfig = getConfig();
    expect(removePlugin('ESLintWebpackPlugin')(developmentConfig).plugins).toMatchSnapshot();
  });
  test('clean ForkTsCheckerWebpackPlugin plugin', () => {
    const developmentConfig = getConfig();
    expect(cleanPlugin(ForkTsCheckerWebpackPlugin)(developmentConfig).plugins).toMatchSnapshot();
  });
});

describe('addSourceMapLoader', () => {
  test('changeSourceMapLoader', () => {
    const developmentConfig = getConfig();
    expect(addSourceMapLoader()(developmentConfig).module.rules[0]).toMatchSnapshot();
  });
});
