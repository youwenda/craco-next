const webpack = require('webpack');
const dllConfigFactory = require('../utils/webpack.config.dll');

module.exports = function dll() {
  return new Promise((resolve, reject) => {
    webpack(dllConfigFactory, (err, stats) => {
      // 处理webpack本身的error
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return reject();
      }

      const info = stats.toJson();
      // 处理代码编译中产生的error
      if (stats.hasErrors()) {
        console.error(info.errors);
        return reject();
      }
      //处理代码编译中产生的warning
      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
      // Done processing
      console.log(
        stats.toString({
          chunks: false, // Makes the build much quieter
          colors: true, // Shows colors in the console
        })
      );
      return resolve();
    });
  });
};
