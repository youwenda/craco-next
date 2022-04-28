const fs = require('fs');
const path = require('path');
const nodeLibs = require('node-libs-browser');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const paths = require('react-scripts/config/paths');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { configOverrides } = require('./paths');
const FilterCSSConflictingWarning = require('../plugins/FilterCSSConflictingWarning');
const ConsoleBrowserUrlPlugin = require('../plugins/ConsoleBrowserUrlPlugin');
const {
  override,
  addBundleVisualizer,
  addLessLoader,
  addFileLoader,
  addSassLoader,
  addCssLoader,
  addPlugin,
  addMultipleEntries,
  addWebpackAlias,
  addSourceMapLoader,
  removePlugin,
  removeModuleScopePlugin,
  fixBabelImports,
  mergeOutput,
  mergeOptimization,
  mergeWebpackResolveFallback,
  useBabelRc,
  setWebpackStats,
} = require('customize-cra-extra');

function getUserConfig() {
  let userConfig = {};
  if (fs.existsSync(configOverrides)) {
    userConfig = require(configOverrides);
  }

  const webpack =
    typeof userConfig === 'function' ? userConfig : userConfig.webpack || ((config) => config);
  const devServer =
    userConfig.devServer ||
    userConfig.devserver ||
    ((configFunction) => (proxy, allowedHost) => configFunction(proxy, allowedHost));
  const jest = userConfig.jest || ((config) => config);
  const paths = userConfig.paths || ((paths) => paths);

  return {
    webpack,
    devServer,
    jest,
    paths,
  };
}

function getConfig() {
  const userConfig = getUserConfig();
  return {
    /**
     * [webpack description]
     *
     * @param   {Object}  config  [CRA's webpack config]
     * @param   {String}  env     [process.env.NODE_ENV 'development' || 'production']
     *
     * @return  {Object}          [return new webpack config]
     */
    webpack(config, env) {
      const isProduction = env === 'production';
      const isDevelopment = env === 'development';

      const {
        DISABLE_NODE_POLYFILLS,
        GENERATE_BUNDLE_REPORT,
        TS_CHECKER,
        NO_VENDORS_DLL,
        USE_STYLE_LOADER,
      } = process.env;
      const disableNodePolyfills = DISABLE_NODE_POLYFILLS !== 'false';

      const webpackConfig = override(
        // Entry
        addMultipleEntries(
          [
            {
              entry: 'index',
              template: paths.appHtml,
            },
          ],
          paths.appSrc,
          true /* internal used only */
        ),
        // Output
        mergeOutput({
          filename: '[name].js',
          // There are also additional JS chunk files if you use code splitting.
          chunkFilename: `chunks/[name]${isDevelopment ? '' : '.[contenthash:8]'}.js`,
          assetModuleFilename: 'media/[name].[hash][ext]',
        }),

        // Loaders
        addLessLoader(),
        addSassLoader(),
        addCssLoader(),
        addSourceMapLoader(),
        addFileLoader(),
        useBabelRc(), // eslint-disable-line
        // Plugins
        // removePlugin(GenerateSW),
        removeModuleScopePlugin(),
        removePlugin('WebpackManifestPlugin'),
        TS_CHECKER === 'false' && removePlugin('ForkTsCheckerWarningWebpackPlugin'),
        TS_CHECKER === 'false' && removePlugin('ForkTsCheckerWebpackPlugin'),

        isProduction && removePlugin(MiniCssExtractPlugin),
        isProduction && GENERATE_BUNDLE_REPORT && addBundleVisualizer(),
        //@note 适配customize-cra-extra 1.0.1-alpha.1版本mini-css-extract-plugin一直存在的情况
        USE_STYLE_LOADER !== 'true' &&
          addPlugin(
            new MiniCssExtractPlugin({
              // Options similar to the same options in webpackOptions.output
              // both options are optional
              // filename: 'static/css/[name].[contenthash:8].css',
              // chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
              filename: '[name].css',
              chunkFilename: `chunks/[name]${isDevelopment ? '' : '.[contenthash:8]'}.css`,
            })
          ),
        NO_VENDORS_DLL !== 'true' &&
          addPlugin(
            new webpack.DllReferencePlugin({
              context: paths.appPath,
              manifest: path.resolve(
                isDevelopment ? paths.appPublic : paths.appBuild,
                './vendors/vendors-manifest.json'
              ),
            })
          ),
        addPlugin(new WebpackBar()),
        addPlugin(new FilterCSSConflictingWarning()),
        !disableNodePolyfills &&
          addPlugin(
            new webpack.ProvidePlugin({
              process: nodeLibs['process'],
            })
          ),
        !disableNodePolyfills &&
          addPlugin(
            // ref: https://github.com/umijs/umi/issues/6914
            new webpack.ProvidePlugin({
              Buffer: ['buffer', 'Buffer'],
            })
          ),
        isDevelopment && addPlugin(new ConsoleBrowserUrlPlugin()),

        // babel import plugin
        fixBabelImports('lodash', {
          libraryDirectory: '',
          camel2DashComponentName: false,
        }),

        // optimization
        mergeOptimization({
          splitChunks: {
            chunks: 'async',
            name: false,
          },
          runtimeChunk: !isProduction,
        }),

        // fallback node
        !disableNodePolyfills &&
          mergeWebpackResolveFallback(
            Object.assign(
              Object.keys(nodeLibs).reduce((memo, key) => {
                if (nodeLibs[key]) {
                  memo[key] = nodeLibs[key];
                } else {
                  memo[key] = false;
                }
                return memo;
              }, {}),
              {
                http: false,
                https: false,
              }
            )
          ),
        // stats
        setWebpackStats('errors-only'),

        addWebpackAlias({
          '@': paths.appSrc,
        })
      )(config, env);

      // 交由项目配置再次更改
      return userConfig.webpack(webpackConfig, env);
    },
    /**
     * [devServer description]
     *
     * @param   {Function}  configFunction  [CRA's webpackDevServer.config.js module.exports ]
     * @param   {String}  env             [process.env.NODE_ENV 'development' || 'production']
     *
     * @return  {Object}                  [return new webpack devServer config]
     */
    devServer(configFunction, env) {
      const devServer = function (proxy, allowedHost) {
        const { HTTPS_KEY, HTTPS_CERT } = process.env;

        if (HTTPS_KEY) {
          process.env.SSL_KEY_FILE = HTTPS_KEY;
        }
        if (HTTPS_CERT) {
          process.env.SSL_CERT_FILE = HTTPS_CERT;
        }
        // Create the default config by calling configFunction with the proxy/allowedHost parameters
        const config = configFunction(proxy, allowedHost);
        // Change the https certificate options to match your certificate, using the .env file to
        // set the file paths & passphrase.

        let onBeforeSetupMiddleware, onAfterSetupMiddleware;
        if (typeof config.onBeforeSetupMiddleware === 'function') {
          onBeforeSetupMiddleware = config.onBeforeSetupMiddleware;
          delete config.onBeforeSetupMiddleware;
        }
        if (typeof config.onAfterSetupMiddleware === 'function') {
          onAfterSetupMiddleware = config.onAfterSetupMiddleware;
          delete config.onAfterSetupMiddleware;
        }

        config.setupMiddlewares = (middlewares, devServer) => {
          if (onBeforeSetupMiddleware) {
            onBeforeSetupMiddleware(devServer);
          }

          if (onAfterSetupMiddleware) {
            onAfterSetupMiddleware(devServer);
          }
          return middlewares;
        };

        // Return your customised Webpack Development Server config.
        return config;
      };
      // 交由项目配置再次更改
      return userConfig.devServer(devServer, env);
    },
    paths(paths, env) {
      return userConfig.paths(paths, env);
    },
    jest(...args) {
      return userConfig.jest(...args);
    },
  };
}

module.exports = getConfig;
