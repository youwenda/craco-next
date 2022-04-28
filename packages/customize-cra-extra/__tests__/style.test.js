const { override } = require('../lib');
const { addSassLoader } = require('../lib');
const { addCssLoader } = require('../lib');
const { addLessLoader } = require('../lib');
const { addPostcssPlugins } = require('../lib');

const { getConfig, traverse } = require('./config');

describe('addLessLoader', () => {
  test('addLessLoader', () => {
    const developmentConfig = getConfig();
    expect(
      traverse(addLessLoader()(developmentConfig)).module.rules[1].oneOf.slice(-3)
    ).toMatchSnapshot();
  });
  test('addLessLoader use less options', () => {
    const developmentConfig = getConfig();
    expect(
      traverse(
        addLessLoader({
          modifyVars: {
            'primary-color': '#4880FF',
            'link-color': '#4880FF',
            'font-size-base': '12px',
            'text-color': '#333',
            'text-color-secondary': '#999',
            'success-color': '#6AC500',
            'warning-color': '#FFA033',
            'heading-color': '#333',
            'border-color-base': '#E6E6E6',
            'primary': '#4D7FFF',
            'primary_hover': '#70a0ff',
            'green_2l': '70a0ff',
            'radius': '12px',
          },
          javascriptEnabled: true,
        })(developmentConfig)
      ).module.rules[1].oneOf.slice(-3)
    ).toMatchSnapshot();
  });
  test('addLessLoader use less other options', () => {
    const developmentConfig = getConfig();
    expect(
      traverse(
        addLessLoader({
          webpackImporter: false,
          lessOptions: {},
        })(developmentConfig)
      ).module.rules[1].oneOf.slice(-3)
    ).toMatchSnapshot();
  });
  test('addLessLoader use style-loader', () => {
    process.env.USE_STYLE_LOADER = 'true';
    const developmentConfig = getConfig();
    expect(
      traverse(addLessLoader()(developmentConfig)).module.rules[1].oneOf.slice(-3)
    ).toMatchSnapshot();
    delete process.env.USE_STYLE_LOADER;
  });
});

describe('addCssLoader', () => {
  test('default use mini-css-extract-plugin', () => {
    const developmentConfig = getConfig();
    expect(
      traverse(addCssLoader()(developmentConfig)).module.rules[1].oneOf.slice(5, 7)
    ).toMatchSnapshot();
  });
  test('use style-loader', () => {
    process.env.USE_STYLE_LOADER = 'true';
    const developmentConfig = getConfig();
    expect(
      traverse(addCssLoader()(developmentConfig)).module.rules[1].oneOf.slice(5, 7)
    ).toMatchSnapshot();
    delete process.env.USE_STYLE_LOADER;
  });
});

describe('style', () => {
  test('test style', () => {
    const developmentConfig = getConfig();
    expect(
      traverse(
        override(
          addLessLoader(),
          addSassLoader(),
          addCssLoader(),
          addPostcssPlugins([
            [
              'postcss-px-to-viewport',
              {
                unitToConvert: 'rpx',
                viewportWidth: 750,
                unitPrecision: 5,
                replace: false,
              },
            ],
            'postcss-plugin-px2rem',
            require('postcss-normalize')(),
          ])
        )(developmentConfig)
      ).module.rules[1].oneOf
    ).toMatchSnapshot();
  });
});
