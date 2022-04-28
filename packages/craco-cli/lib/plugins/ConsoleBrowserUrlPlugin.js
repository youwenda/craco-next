const fs = require('fs');
const chalk = require('chalk');
const shell = require('shelljs');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const paths = require('react-scripts/config/paths');
const useTypeScript = fs.existsSync(paths.appTsConfig);

class ConsoleBrowserUrlPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('done', (stats) => {
      const { TS_COMPILER, AUTO_OPEN_BROWSER_URL: browserUrl } = process.env;
      if (!browserUrl) {
        return;
      }
      const messages = formatWebpackMessages(
        stats.toJson({ all: false, warnings: true, errors: true })
      );
      if (messages.warnings.length) {
        console.log(chalk.green(`编译完成，可以打开页面 ${browserUrl} 显示应用`));
      }
      if (TS_COMPILER === 'true' && useTypeScript) {
        if (shell.exec('which tsc', { silent: true }).code != 0) {
          console.error(chalk.red('✘ typescript编译失败，请安装tsc'));
          return;
        }
        shell.exec('npx tsc', { async: true });
      }
    });
  }
}

module.exports = ConsoleBrowserUrlPlugin;
