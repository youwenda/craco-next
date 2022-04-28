const { getConfig } = require('./config');
const {
  addDecoratorsLegacy,
  addBabelPreset,
  addBabelIncludes,
  getBabelLoader,
  fixBabelImports,
  override,
  useBabelRc,
  removeModuleScopePlugin,
} = require('../lib');

describe('getBabelLoader', () => {
  test('get in src modules', () => {
    const config = getConfig();
    expect(
      getBabelLoader(
        override(
          addBabelIncludes(['lib', 'es']),
          addBabelPreset('@babel/preset-env'),
          useBabelRc(),
          addDecoratorsLegacy(),
          fixBabelImports('lodash', {
            libraryDirectory: '',
            camel2DashComponentName: false,
          }),
        )(config)
      )
    ).toMatchSnapshot();
  });
});

describe('removeModuleScopePlugin', () => {
  test('removeModuleScopePlugin', () => {
    const config = getConfig();
    expect(removeModuleScopePlugin()(config).resolve.plugins.length).toBe(0);
  });
});
