const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const paths = require('react-scripts/config/paths');
const appPackage = require(paths.appPackageJson);
const library = 'vendors';
const isProduction = process.env.NODE_ENV === 'production';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const vendorsExtra = [];

let vendorsDll = Array.from(
  new Set([
    'es6-promise',
    'classnames',
    'history',
    'react',
    'react-dom',
    'react-redux',
    'react-router-dom',
    'redux',
    ...vendorsExtra,
  ])
).filter((vendor) => appPackage.dependencies[vendor]);
let outputPath = path.resolve(paths.appPublic, library);

if (isProduction) {
  outputPath = path.resolve(paths.appBuild, library);
}

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    vendorsDll,
  },
  output: {
    filename: 'vendors.dll.js',
    path: outputPath,
    library,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      path: path.resolve(outputPath, './vendors-manifest.json'),
      // This must match the output.library option above
      name: library,
    }),
  ],
  devtool: shouldUseSourceMap ? 'source-map' : false,
};

module.exports = config;
