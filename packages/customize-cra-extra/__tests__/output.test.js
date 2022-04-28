const { mergeOutput, mergeOptimization, mergeWebpackResolveFallback } = require('../lib');
const { getConfig } = require('./config');
describe('merge', () => {
  test('test mergeOutput', () => {
    const developmentConfig = getConfig();
    const isEnvDevelopment = true;
    expect(
      mergeOutput({
        filename: '[name].js',
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: `chunks/[name]${isEnvDevelopment ? '' : '.[contenthash:8]'}.js`,
        assetModuleFilename: 'media/[name].[hash][ext]',
      })(developmentConfig).output
    ).toMatchSnapshot();
  });
  test('test mergeOptimization', () => {
    const developmentConfig = getConfig();
    const isEnvProduction = false;
    expect(
      mergeOptimization({
        splitChunks: {
          chunks: 'async',
          name: false,
        },
        runtimeChunk: !isEnvProduction,
      })(developmentConfig).optimization
    ).toMatchSnapshot();
  });

  test('test mergeWebpackResolveFallback', () => {
    const developmentConfig = getConfig();
    expect(
      mergeWebpackResolveFallback({
        assert: false,
        buffer: false,
        console: false,
        constants: false,
        crypto: false,
        domain: false,
        events: false,
        http: false,
        https: false,
        os: false,
        path: false,
        punycode: false,
        process: false,
        querystring: false,
        stream: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
        url: false,
        util: false,
        vm: false,
        zlib: false,
      })(developmentConfig).resolve.fallback
    ).toMatchSnapshot();
  });
});
