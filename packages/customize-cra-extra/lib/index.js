const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const cra = require('customize-cra');
const paths = require('react-scripts/config/paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InjectPlugin = require('webpack-inject-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
/**
 *
 * @param {Array|string} includes
 * @param {Boolean} isOutsideOfApp
 * @returns webpack config
 */
const addBabelIncludes = (includes, isOutsideOfApp) => (config) => {
  const babelLoader = cra.getBabelLoader(config, isOutsideOfApp);
  if (!babelLoader.include) {
    babelLoader.include = [];
  } else if (!Array.isArray(babelLoader.include)) {
    babelLoader.include = [babelLoader.include];
  }
  if (!Array.isArray(includes)) {
    includes = [includes];
  }
  babelLoader.include.push(...includes);
  return config;
};

const removeBabelPlugin =
  (pluginName = '', isOutsideOfApp) =>
  (config) => {
    const babelLoader = cra.getBabelLoader(config, isOutsideOfApp);
    // only internal babel has plugins
    if (Array.isArray(babelLoader.options.plugins)) {
      babelLoader.options.plugins = babelLoader.options.plugins.filter((p) => {
        if (typeof p === 'string') {
          return !~p.indexOf(pluginName);
        } else if (typeof p === 'function') {
          return p.constructor.name !== pluginName;
        }
        return true;
      });
    }
    return config;
  };

const removeInternalBabelPlugin =
  (pluginName = '') =>
  (config) =>
    removeBabelPlugin(pluginName)(config);
const cleanInternalBabelPlugin =
  (pluginName = '') =>
  (config) =>
    removeBabelPlugin(pluginName)(config);

const addLoader = (loader) => (config) => {
  const loaders = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;
  // Insert sass-loader as the penultimate item of loaders (before file-loader)
  loaders.splice(loaders.length - 1, 0, loader);
  return config;
};

const addLoaders = (loaders) => (config) => {
  loaders.forEach((loader) => addLoader(loader)(config));
  return config;
};

const removeLoader =
  (loaderName = '') =>
  (config) => {
    let rules = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;
    let loaderFilter = (rule) =>
      typeof rule === 'string'
        ? rule.includes(loaderName)
        : rule.loader && rule.loader.includes(loaderName);

    if (!loaderName) {
      return config;
    }

    for (let i = rules.length - 1; i >= 0; i--) {
      const rule = rules[i];
      const use = rule.use || [];
      if (loaderFilter(rule)) {
        rules.splice(i, 1);
      }
      if (use.find(loaderFilter)) {
        rules.splice(i, 1);
      }
    }
    return config;
  };

const addPlugin = (plugin) => (config) => {
  config.plugins.push(plugin);
  return config;
};

const addPlugins = (plugins) => (config) => {
  plugins.forEach((plugin) => config.plugins.push(plugin));
  return config;
};

const removePlugin =
  (pluginName = '') =>
  (config) => {
    if (!pluginName) {
      return config;
    }
    config.plugins = config.plugins.filter((plugin) => {
      if (typeof pluginName === 'string') {
        let flag = plugin.constructor.name !== pluginName;
        if (flag) {
          try {
            pluginName = require(pluginName);
            flag = !(plugin instanceof pluginName);
          } catch (e) {
            flag = true;
          }
        }
        return flag;
      }
      if (typeof pluginName === 'function') {
        return !(plugin instanceof pluginName);
      }
    });
    return config;
  };

const cleanLoader = removeLoader;
const cleanPlugin = removePlugin;

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor, preProcessorOptions) => {
  const { NODE_ENV, USE_STYLE_LOADER, GENERATE_SOURCEMAP } = process.env;
  const isEnvDevelopment = NODE_ENV === 'development';
  const isEnvProduction = NODE_ENV === 'production';
  const useStyleLoader = USE_STYLE_LOADER === 'true';
  const shouldUseSourceMap = GENERATE_SOURCEMAP !== 'false';
  // Check if Tailwind config exists
  const useTailwind = fs.existsSync(path.join(paths.appPath, 'tailwind.config.js'));
  const loaders = [
    useStyleLoader && require.resolve('style-loader'),
    !useStyleLoader && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {},
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          config: false,
          plugins: !useTailwind
            ? [
                'postcss-flexbugs-fixes',
                [
                  'postcss-preset-env',
                  {
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 4,
                  },
                ],
                // Adds PostCSS Normalize as the reset css with default options,
                // so that it honors browserslist config in package.json
                // which in turn let's users customize the target behavior as per their needs.
                'postcss-normalize',
              ]
            : [
                'tailwindcss',
                'postcss-flexbugs-fixes',
                [
                  'postcss-preset-env',
                  {
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 4,
                  },
                ],
              ],
        },
        sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          root: paths.appSrc,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: Object.assign(
          {
            sourceMap: true,
          },
          preProcessorOptions
        ),
      }
    );
  }
  return loaders;
};

const addLessLoader = (loaderOptions) => (config) => {
  const { NODE_ENV, GENERATE_SOURCEMAP } = process.env;
  const isEnvDevelopment = NODE_ENV === 'development';
  const isEnvProduction = NODE_ENV === 'production';
  const shouldUseSourceMap = GENERATE_SOURCEMAP !== 'false';

  config = cleanLoader('less-loader')(config);

  if (loaderOptions) {
    loaderOptions = loaderOptions.lessOptions ? loaderOptions : { lessOptions: loaderOptions };
  }

  const lessRegex = /\.less$/;
  const lessModuleRegex = /\.module\.less$/;
  const loaders = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;

  // Insert less-loader as the penultimate item of loaders (before file-loader)
  loaders.splice(
    loaders.length - 1,
    0,
    {
      test: lessRegex,
      exclude: lessModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          modules: {
            mode: 'icss',
          },
        },
        'less-loader',
        loaderOptions
      ),
      sideEffects: true,
    },
    {
      test: lessModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          modules: {
            mode: 'local',
            getLocalIdent: getCSSModuleLocalIdent,
          },
        },
        'less-loader',
        loaderOptions
      ),
    }
  );

  return config;
};

const addSassLoader =
  (loaderOptions = {}) =>
  (config) => {
    const { NODE_ENV, GENERATE_SOURCEMAP } = process.env;
    const isEnvDevelopment = NODE_ENV === 'development';
    const isEnvProduction = NODE_ENV === 'production';
    const shouldUseSourceMap = GENERATE_SOURCEMAP !== 'false';
    config = cleanLoader('sass-loader')(config);

    const sassRegex = /\.(scss|sass)$/;
    const sassModuleRegex = /\.module\.(scss|sass)$/;
    const loaders = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;

    // Insert sass-loader as the penultimate item of loaders (before file-loader)
    loaders.splice(
      loaders.length - 1,
      0,
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            modules: {
              mode: 'icss',
            },
          },
          'sass-loader',
          loaderOptions
        ),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
      // Adds support for CSS Modules, but using SASS
      // using the extension .module.scss or .module.sass
      {
        test: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            modules: {
              mode: 'local',
              getLocalIdent: getCSSModuleLocalIdent,
            },
          },
          'sass-loader',
          loaderOptions
        ),
      }
    );

    return config;
  };

const addCssLoader = () => (config) => {
  const rules = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;
  const { USE_STYLE_LOADER } = process.env;
  const useStyleLoader = USE_STYLE_LOADER === 'true';

  // 处理没有css预处理器less-loader 和 sass-loader的情况。
  for (let i = rules.length - 1; i >= 0; i--) {
    let rule = rules[i];
    if (rule.test && rule.test instanceof RegExp && ~rule.test.toString().indexOf('.css$')) {
      let len = (rule.use && rule.use.length) || 1;
      while (len--) {
        const useLoader = typeof rule.use[len] === 'string' ? rule.use[len] : rule.use[len].loader;
        if (useStyleLoader) {
          // 删除mini-css-extract loader
          if (~`${useLoader}`.indexOf('mini-css-extract-plugin')) {
            rule.use.splice(len, 1, {
              loader: require.resolve('style-loader'),
            });
          }
        } else if (~`${useLoader}`.indexOf('style-loader')) {
          rule.use.splice(len, 1, {
            loader: MiniCssExtractPlugin.loader,
            options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {},
          });
        }
        if (~`${useLoader}`.indexOf('postcss-loader')) {
          const useTailwind = fs.existsSync(path.join(paths.appPath, 'tailwind.config.js'));
          rule.use[len] = {
            loader: useLoader,
            options: {
              postcssOptions: {
                // Necessary for external CSS imports to work
                // https://github.com/facebook/create-react-app/issues/2677
                ident: 'postcss',
                config: false,
                plugins: !useTailwind
                  ? [
                      'postcss-flexbugs-fixes',
                      [
                        'postcss-preset-env',
                        {
                          autoprefixer: {
                            flexbox: 'no-2009',
                          },
                          stage: 4,
                        },
                      ],
                      // Adds PostCSS Normalize as the reset css with default options,
                      // so that it honors browserslist config in package.json
                      // which in turn let's users customize the target behavior as per their needs.
                      'postcss-normalize',
                    ]
                  : [
                      'tailwindcss',
                      'postcss-flexbugs-fixes',
                      [
                        'postcss-preset-env',
                        {
                          autoprefixer: {
                            flexbox: 'no-2009',
                          },
                          stage: 4,
                        },
                      ],
                    ],
              },
              sourceMap: false,
            },
          };
        }
      }
    }
  }

  return config;
};

const addPostcssPlugins = (plugins) => (config) => {
  const rules = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;
  if (!Array.isArray(plugins)) {
    plugins = [plugins];
  }
  if (!plugins.length) {
    return config;
  }
  for (let i = rules.length - 1; i >= 0; i--) {
    const use = rules[i].use || [];
    for (let j = use.length - 1; j >= 0; j--) {
      let useLoader = typeof use[i] === 'string' ? use[i] : use[j].loader;
      if (~`${useLoader}`.indexOf('postcss-loader')) {
        let options = use[j].options;
        if (!options) {
          use[j] = {
            loader: useLoader,
            options: {
              postcssOptions: {
                'ident': 'postcss',
                plugins: [...plugins],
              },
            },
          };
        } else if (!options.postcssOptions) {
          use[j].options.postcssOptions = {
            'ident': 'postcss',
            plugins: [...plugins],
          };
        } else {
          let originalPlugins = use[j].options.postcssOptions.plugins || [];
          if (!Array.isArray(originalPlugins)) {
            originalPlugins = [];
          }
          use[j].options.postcssOptions.plugins = [...originalPlugins, ...plugins];
        }
      }
    }
  }
  return config;
};

const addFileLoader = () => (config) => {
  const staticReg = /^static\//;
  const loaderReg = /[\\/](url|file)-loader[\\/]/;
  const rules = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;
  const ruleFilter = (rule) =>
    loaderReg.test(rule.loader) && rule.options && staticReg.test(rule.options.name);
  for (let i = rules.length - 1; i >= 0; i--) {
    const rule = rules[i];
    if (ruleFilter(rule)) {
      rule.options.name = rule.options.name.replace(staticReg, '');
    } else if (Array.isArray(rule.use)) {
      rule.use.forEach((rule) => {
        if (ruleFilter(rule)) {
          rule.options.name = rule.options.name.replace(staticReg, '');
        }
      });
    }
  }
  return config;
};

const addSourceMapLoader = () => (config) => {
  const { GENERATE_SOURCEMAP } = process.env;
  if (GENERATE_SOURCEMAP === 'false') {
    return config;
  }
  const sourceMapLoaderRule = config.module.rules.find((rule) =>
    /source-map-loader/.test(rule.loader)
  );
  if (sourceMapLoaderRule) {
    sourceMapLoaderRule.exclude = /node_modules/;
  }
  return config;
};

const moduleEntry = {};
const addMultipleEntries =
  (
    entries = [],
    cwd = paths.appSrc,
    override = false,
    injectCode = `(function() {
  var scripts = document.getElementsByTagName('script');
  var script = scripts[scripts.length - 1];
  var src = script.getAttribute('src');
  if (src) {
    var base = src.replace(/(.+\\/)(.+)/, '$1');
    __webpack_public_path__ = base;
  }
})();`
  ) =>
  (config) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production' || !isDevelopment;
    const shouldUseReactRefresh = process.env.FAST_REFRESH !== 'false';
    if (!Array.isArray(entries)) {
      console.error(chalk.red('✘ addMultipleEntries need Array Params'));
      process.exit(0);
    }
    if (entries.length) {
      const entry = {};
      const moduleFileExtensions = ['', '.mjs', '.js', '.jsx', '.ts', '.tsx'];
      const plugins = [];
      entries.forEach((v) => {
        if (v.entry) {
          let chunk = v.name || v.entry.replace(/\.(?:.*)?$/, '');
          if (moduleFileExtensions.includes(path.extname(v.entry))) {
            moduleEntry[chunk] = true;
          }
          entry[chunk] = []
            .concat(
              (isDevelopment &&
                !shouldUseReactRefresh &&
                require.resolve('react-dev-utils/webpackHotDevClient')) ||
                []
            )
            .concat(path.resolve(cwd, './', v.entry));
          if (v.template) {
            plugins.push(
              new HtmlWebpackPlugin(
                Object.assign(
                  {},
                  {
                    inject: true,
                    template: v.template,
                    chunks: [chunk],
                    filename: `${chunk}.html`,
                    scriptLoading: 'blocking',
                  },
                  isProduction
                    ? {
                        minify: {
                          removeComments: true,
                          collapseWhitespace: true,
                          removeRedundantAttributes: true,
                          useShortDoctype: true,
                          removeEmptyAttributes: true,
                          removeStyleLinkTypeAttributes: true,
                          keepClosingSlash: true,
                          minifyJS: true,
                          minifyCSS: true,
                          minifyURLs: true,
                        },
                      }
                    : undefined
                )
              )
            );
          }
        }
      });
      if (Object.keys(entry).length) {
        if (Array.isArray(config.entry)) {
          config.entry = entry;
        } else {
          if (typeof config.entry === 'string') {
            config.entry = {
              main: config.entry,
            };
          }
          config.entry = {
            ...(override ? {} : config.entry || {}),
            ...entry,
          };
        }
      }
      if (plugins.length) {
        for (let i = config.plugins.length - 1; i >= 0; i--) {
          if (config.plugins[i] instanceof HtmlWebpackPlugin) {
            config.plugins.splice(i, 1);
          }
        }
        config.plugins = plugins.concat(config.plugins);
      }
      if (injectCode && isProduction) {
        config = cleanPlugin(InjectPlugin.default)(config);
        config.plugins.push(
          new InjectPlugin.default(
            function () {
              return injectCode;
            },
            {
              entryOrder: 'First',
              // entryName: (name) => moduleEntry[name],
            }
          )
        );
      }
    }
    return config;
  };

const disableEsLint = () => (config) => {
  process.env.DISABLE_ESLINT_PLUGIN = 'true';
  return config;
};

const mergeOutput =
  (output = {}) =>
  (config) => {
    Object.assign(config.output, {
      ...(output || {}),
    });
    return config;
  };

const mergeOptimization =
  (optimization = {}) =>
  (config) => {
    Object.assign(config.optimization, {
      ...(optimization || {}),
    });
    return config;
  };

const mergeWebpackResolveFallback =
  (fallback = {}) =>
  (config) => {
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }
    Object.assign(config.resolve.fallback, fallback);
    return config;
  };

const useEslintRc = () => (config) => {
  console.error(chalk.yellow('\nuseEslintRc is deprecated!\n'));
  return config;
};

require.cache[require.resolve('customize-cra')].exports.addLessLoader = addLessLoader;
require.cache[require.resolve('customize-cra')].exports.removeInternalBabelPlugin =
  removeInternalBabelPlugin;
require.cache[require.resolve('customize-cra')].exports.addPostcssPlugins = addPostcssPlugins;
require.cache[require.resolve('customize-cra')].exports.disableEsLint = disableEsLint;
require.cache[require.resolve('customize-cra')].exports.useEslintRc = useEslintRc;

module.exports = {
  ...cra,
  addBabelIncludes,
  addLoader,
  addLoaders,
  addPlugin,
  addPlugins,
  addLessLoader,
  addSassLoader,
  addCssLoader,
  addFileLoader,
  addPostcssPlugins,
  addMultipleEntries,
  addSourceMapLoader,

  cleanLoader,
  cleanPlugin,
  cleanInternalBabelPlugin,

  disableEsLint,

  removeLoader,
  removePlugin,
  removeInternalBabelPlugin,

  mergeOutput,
  mergeOptimization,
  mergeWebpackResolveFallback,
};
