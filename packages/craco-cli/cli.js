#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const semver = require('semver');
const packageJson = require('./package.json');

if (!semver.satisfies(process.version, '>= 10.20.1')) {
  console.error(chalk.red('✘ 当前nodejs版本过低，请至少安装v10.20.1以上的nodejs版本'));
  process.exit(1);
}

(async () => {
  program
    .version(packageJson.version)
    .arguments('<command> [options]')
    .usage('<command> [options]')
    .allowUnknownOption()
    .option('--color', '开启color')
    .on('--help', () => {
      console.log();
      console.log(chalk.gray('  Examples:'));
      console.log();
      console.log('    craco-cli start');
      console.log('    craco-cli build');
      console.log();
    });

  program
    .command('init')
    .description(chalk.green('初始化创建项目'))
    .action((options) => {
      require('./lib/commands/init')(options);
    })
    .on('--help', () => {
      console.log();
      console.log(chalk.gray('  Examples:'));
      console.log();
      console.log(`    npm create taojimu-miniapp ${chalk.green('<project-directory>')}`);
      console.log();
    });

  program
    .command('start')
    .description(
      chalk.green(
        'Runs the app in the development mode. Default Open http://localhost:3000 to view it in the browser'
      )
    )
    .option('--color', '开启color')
    .action((options) => {
      require('./lib/commands/start')(options);
    })
    .on('--help', () => {
      console.log();
      console.log(chalk.gray('  Examples:'));
      console.log();
      console.log(`    craco-cli start)}`);
      console.log();
    });

  program
    .command('build')
    .description(
      chalk.green(
        'Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.'
      )
    )
    .option('--color', '开启color')
    .action((options) => {
      require('./lib/commands/build')(options);
    })
    .on('--help', () => {
      console.log();
      console.log(chalk.gray('  Examples:'));
      console.log();
      console.log(`    craco-cli build)}`);
      console.log();
    });

  program
    .command('dll')
    .description(
      chalk.green(
        '执行dll构建，对于加速启动速度和命中缓存有很大提升，默认已经集成到start和build命令中，可单独使用该命令更新dll文件'
      )
    )
    .action((options) => {
      require('./lib/commands/dll')(options);
    })
    .on('--help', () => {
      console.log();
      console.log(chalk.gray('  Examples:'));
      console.log();
      console.log('    craco-cli dll');
      console.log();
    });

  program
    .command('test')
    .description(chalk.green('运行测试'))
    .action((options) => {
      require('./lib/commands/test')(options);
    })
    .on('--help', () => {
      console.log();
      console.log(chalk.gray('  Examples:'));
      console.log();
      console.log('    craco-cli test');
      console.log();
    });

  program.parse(process.argv);
  const proc = program.runningCommand;

  if (proc) {
    proc.on('close', process.exit.bind(process));
    proc.on('error', () => {
      process.exit(1);
    });
    process.on('SIGINT', () => {
      console.log(chalk.red(`\n  用户终止进程 \n`));
      process.exit(1);
    });
  }

  const subCmd = program.args[0];
  if (!subCmd) {
    console.log(chalk.red(`\n  ✘ 请输入正确的命令，查看命令帮助请输入：craco-cli -h \n`));
    program.help();
  }
})();
