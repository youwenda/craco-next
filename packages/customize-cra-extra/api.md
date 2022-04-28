# api docs

This file documents the functions exported by `customize-cra-extra-extra`.

- [addLoader](#addloaderloader)
- [addLoaders](#addloadersloaders)
- [addPlugin](#addpluginplugin)
- [addPlugins](#addpluginsplugins)
- [addLessLoader](#addlessloaderloaderoptions)
- [addSassLoader](#addsassloaderloaderoptions)
- [addPostcssPlugins](#addpostcsspluginsplugins)
- [addMultipleEntries](#addmultipleentriesentries)
- [addBabelIncludes](#addbabelincludesincludes)
- [addExternalBabelPlugin](#addexternalbabelpluginplugin)
- [addExternalBabelPlugins](#addexternalbabelpluginsplugins)
- [addBabelPlugin](#addbabelpluginplugin)
- [addBabelPlugins](#addbabelpluginsplugins)
- [addBabelPreset](#addbabelpresetpreset)
- [addBabelPresets](#addbabelpresetspresets)
- [babelInclude](#babelinclude)
- [babelExclude](#babelexcludeexclude)
- [removeInternalBabelPlugin](#removeinternalbabelpluginpluginname)
- [fixBabelImports](#fixbabelimportslibraryname-options)
- [addDecoratorsLegacy](#adddecoratorslegacy)
- [useBabelRc](#usebabelrc)
- [disableEsLint](#disableeslint)
- [addWebpackAlias](#addwebpackaliasalias)
- [addWebpackResolve](#addwebpackresolveresolve)
- [addWebpackPlugin](#addwebpackpluginplugin)
- [addWebpackExternals](#addwebpackexternalsdeps)
- [addWebpackModuleRule](#addwebpackmodulerulerule)
- [setWebpackTarget](#setwebpacktargettarget)
- [setWebpackStats](#setwebpackstats)
- [addBundleVisualizer](#addbundlevisualizeroptions-behindflag--false)
- [setWebpackOptimizationSplitChunks](#setwebpackoptimizationsplitchunkstarget)
- [disableChunk](#disablechunk)
- [removeModuleScopePlugin](#removemodulescopeplugin)
- [watchAll](#watchall)
- [mergeOutput](#mergeoputput)
- [mergeOptimization](#mergeoptimization)
- [mergeWebpackResolveFallback](#mergewebpackreesolvefallback)
- [addSourceMapLoader](#addsourcemaploader)

## `customizers`

`customizers` are functions that produce modifications to a config object, allowing a user to easily enable or disable `webpack`, `webpack-dev-server`, `babel`, et al., features.
``

### addLoader(loader)

添加`loader`

```javascript
const { addLoader, override } = require('customize-cra-extra');
override(
  addLoader({
    loader: require.resolve('raw-loader'),
  })
);
```

### addLoaders(loaders)

批量添加多个`loader`

```javascript
addLoader([
  {
    loader: require.resolve('raw-loader'),
  },
  {
    loader: require.resolve('file-loader'),
  },
]);
```

### addPlugin(plugin)

添加插件

```javascript
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const WebpackBar = require('webpackbar');

addPlugin(new HardSourceWebpackPlugin());
```

### addPlugins(plugins)

批量添加多个插件

```javascript
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const WebpackBar = require('webpackbar');

addPlugins([
  new HardSourceWebpackPlugin(),
  new WebpackBar()
)]
```

### addLessLoader(loaderOptions)

增加`less-loader`，`less-loader`的配置可以通过参数`loaderOptions`传递.

```js
const { addLessLoader } = require('customize-cra-extra');

module.exports = override(addLessLoader(loaderOptions));
```

`loaderOptions` is optional. If you have Less specific options, you can pass to it. you can open [less-loader](https://www.npmjs.com/package/less-loader) doc to find details. For example:

```js
const { addLessLoader } = require('customize-cra-extra');

module.exports = override(
  addLessLoader({
    lessOptions: {
      strictMath: true,
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
    },
  })
);
```

Check [Less document](http://lesscss.org/usage/#command-line-usage-options) for all available specific options you can use.

Once `less-loader` is enabled, you can import `.less` file in your project.

`.module.less` will use CSS Modules.

> if you use TypeScript with CSS Modules, you should edit `react-app-env.d.ts`.

```typescript
declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}
```

### addSassLoader(loaderOptions)

增加`sass-loader`，`sass-loader`的配置可以通过参数`loaderOptions`传递.

```js
const { addSassLoader } = require('customize-cra-extra');

module.exports = override(addSassLoader(loaderOptions));
```

`loaderOptions` is optional. If you have Less specific options, you can pass to it. you can open [sass-loader](https://www.npmjs.com/package/sass-loader) doc to find details. For example:

```js
const { addSassLoader } = require('customize-cra-extra');

module.exports = override(
  addSassLoader({
    implementation: require('sass'),
    sassOptions: {
      fiber: false,
    },
  })
);
```

### addPostcssPlugins([plugins])

To add post-css plugins, you can use `addPostcssPlugins`.

```javascript
const { override, addPostcssPlugins } = require('customize-cra-extra');

module.exports = override(addPostcssPlugins([require('postcss-px2rem')({ remUnit: 37.5 })]));
```

### addMultipleEntries([entries])

使用该方法可以增加多个`entry`的入口.

```javascript
const { override, addMultipleEntries } = require('customize-cra-extra');
module.exports = override(
  addMultipleEntries([
    {
      entry: 'index',
      template: path.resolve(__dirname, './src/index.html'),
    },
  ])
);
```

### addBabelIncludes(includes)

不同于方法`babelInclude(includes)`中将所有的`includes`参数直接覆盖，而是采用合并处理。

```javascript
const { addBabelIncludes, override } = require('customize-cra-extra');
module.exports = override(addBabelIncludes(['lib', 'es']));
```

### addExternalBabelPlugin(plugin)

`create-react-app` actually has two rules in its `webpack` config for `babel-loader`: one for code in `addSrc` (`src/` by default) and the other for code `external` to that folder (like `node_modules`). You can add plugins to the `external` loader using `addExternalBabelPlugin` in the same way you'd use `addBabelPlugin`.

### addExternalBabelPlugins(plugins)

A simple helper that calls `addExternalBabelPlugin` for each plugin passed.

Note: Make sure to use the spread operator if adding multiple plugins.

```js
module.exports = override(
  ...addExternalBabelPlugins(
    'babel-plugin-transform-do-expressions',
    '@babel/plugin-proposal-object-rest-spread'
  ),
  fixBabelImports('lodash', {
    libraryDirectory: '',
    camel2DashComponentName: false,
  })
);
```

### addBabelPlugin(plugin)

Adds a babel plugin. Whatever you pass for `plugin` will be added to Babel's `plugins` array. Consult their docs for more info.
Note that this rewirer will not add the plugin to the `yarn test`'s Babel configuration. See `useBabelRc()` to learn more.

### addBabelPlugins(plugins)

A simple helper that calls `addBabelPlugin` for each plugin you pass in here. Make sure you use the spread operator when using this, for example

```js
module.exports = override(
  disableEsLint(),
  ...addBabelPlugins('polished', 'emotion', 'babel-plugin-transform-do-expressions'),
  fixBabelImports('lodash', {
    libraryDirectory: '',
    camel2DashComponentName: false,
  })
);
```

### addBabelPreset(preset)

Adds a babel preset. Whatever you pass for `preset` will be added to Babel's `preset` array. Consult their docs for more info.
Note that this rewirer will not add the preset to the `yarn test`'s Babel configuration. See `useBabelRc()` to learn more.

### addBabelPresets(...presets)

A simple helper that calls `addBabelPreset` for each preset you pass in here. Make sure you don't pass an array and use the spread operator when using this, for example

```js
module.exports = override(
  ...addBabelPresets(
    [
      '@babel/env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions'],
        },
        modules: 'commonjs',
      },
    ],
    '@babel/preset-flow',
    '@babel/preset-react'
  )
);
```

### babelInclude

Overwrites the `include` option for babel loader, for when you need to transpile a module in your `node_modules` folder.

```js
module.exports = override(
  babelInclude([
    path.resolve('src'), // make sure you link your own source
    path.resolve('node_modules/native-base-shoutem-theme'),
    path.resolve('node_modules/react-navigation'),
    path.resolve('node_modules/react-native-easy-grid'),
  ])
);
```

### babelExclude(exclude)

Overwrites the `exclude` option for `babel-loader`. Useful for excluding a specific folder that you don't want to be transpiled.

```js
module.exports = override(babelExclude([path.resolve('src/excluded-folder')]));
```

### removeInternalBabelPlugin(pluginName)

Removes a specific `babel` plugin with a constructor name matching `pluginName`from the configuration.

```js
module.exports = override(removeInternalBabelPlugin('plugin-name'));
```

### fixBabelImports(libraryName, options)

Adds the [babel-plugin-import plugin](https://www.npmjs.com/package/babel-plugin-import). See above for an example.

### addDecoratorsLegacy()

Add decorators in legacy mode. Be sure to have `@babel/plugin-proposal-decorators` installed.

### disableEsLint()

Does what it says. You may need this along with `addDecoratorsLegacy` in order to get decorators and exports to parse together.

If you want use `@babel/plugin-proposal-decorators` with EsLint, you can enable `useEslintRc`, described below, with the follow configuration in your `.eslintrc` or `package.json`:

```json
{
  "extends": "react-app",
  "parserOptions": {
    "ecmaFeatures": {
      "legacyDecorators": true
    }
  }
}
```

### addWebpackAlias(alias)

Adds the provided alias info into webpack's alias section. Pass an object literal with as many entries as you'd like, and the whole object will be merged in.

### addWebpackResolve(resolve)

Adds the provided resolve info into webpack's resolve section. Pass an object literal with as many entries as you'd like, and the whole object will be merged in.

### addWebpackPlugin(plugin)

Adds the provided plugin info into webpack's plugin array. Pass a plugin defined with `new webpack.DefinePlugin({...})`

### addWebpackExternals(deps)

Add external dependencies, useful when trying to offload libs to CDN.

For example you can [offload](https://github.com/facebook/create-react-app/issues/2758) `react` and `react-dom` by

```js
addWebpackExternals({
  react: 'React',
  'react-dom': 'ReactDom',
});
```

`addWebpackExternals` can also accept a `string`, `function`, or `regex`. See [the webpack documentation](https://webpack.js.org/configuration/externals/) for more information.

### addWebpackModuleRule(rule)

Adds the provided rule to the webpack config's `module.rules` array.

See https://webpack.js.org/configuration/module/#modulerules for more information

```js
module.exports = {
  override(
    addWebpackModuleRule({test: /\.txt$/, use: 'raw-loader'})
  )
}
```

### setWebpackTarget(target)

Sets the `target` config variable for webpack. This can be, [as described in the webpack docs](https://webpack.js.org/configuration/target/), a string or a function.

```js
module.exports = {
  override(
    setWebpackTarget('electron-renderer')
  )
}
```

### setWebpackStats(stats)

Sets the `stats` attribute for webpack. This is an attribute that can allow you to customize Webpack's error message behaviour, in production builds. This can be, [as described in the webpack docs](https://webpack.js.org/configuration/stats/), a string or an object.

```js
module.exports = {
  override(
    setWebpackStats('errors-only')
  )
}
```

You can configure it to ignore certain expected warning patterns, as create-react-app treats warnings as errors when `CI` env is true:

```js
module.exports = {
  override(
    setWebpackStats({
      warningsFilter: [
        'filter',
        /filter/,
        (warning) => true
      ]
    })
  )
}
```

### addBundleVisualizer(options, behindFlag = false)

Adds the bundle visualizer plugin to your webpack config. Be sure to have `webpack-bundle-analyzer` installed. By default, the options passed to the plugin will be:

```json
{
  "analyzerMode": "static",
  "reportFilename": "report.html"
}
```

You can hide this plugin behind a command line flag (`--analyze`) by passing `true` as second argument.

```js
addBundleVisualizer({}, true);
```

### setWebpackOptimizationSplitChunks(target)

Sets your customized optimization.splitChunks configuration to your webpack config. Please Use this method cautiously because the webpack default config is effective on most of time. By default, the options in create-react-app is:

```json
{
  "chunks": "async",
  "name": false
}
```

You can hide this plugin behind a command line flag (`--analyze`) by passing `true` as second argument.

```js
addBundleVisualizer({}, true);
```

### useBabelRc()

Causes your .babelrc (or .babelrc.js) file to be used, this is especially useful
if you'd rather override the CRA babel configuration and make sure it is consumed
both by `yarn start` and `yarn test` (along with `yarn build`).

```js
// config-overrides.js
module.exports = override(
  useBabelRc()
);

// .babelrc
{
  "presets": ["babel-preset-react-app"],
  "plugins": ["emotion"]
}
```

```js
{
  analyzerMode: "static",
  reportFilename: "report.html"
}
```

which can be overridden with the (optional) options argument.

### disableChunk

Prevents the default static chunking, and forces the entire build into one file. See [this thread](https://github.com/facebook/create-react-app/issues/5306) for more info.

### removeModuleScopePlugin()

This will remove the CRA plugin that prevents to import modules from
outside the `src` directory, useful if you use a different directory.

A common use case is if you are using CRA in a monorepo setup, where your packages
are under `packages/` rather than `src/`.

### watchAll()

When applied, CRA will watch all the project's files, included `node_modules`.
To use it, just apply it and run the dev server with `yarn start --watch-all`.

```js
watchAll();
```

### mergeOutput

自定义`webpack.output` 的配置。和原有的配置做一层`merge`处理。

> 原有的 output 配置

```js
// webpack.config.js
module.exports = {
  output: {},
};
```

### mergeOptimization

自定义`webpack.optimization` 的配置。和原有的配置做一层`merge`处理。

> 原有的`optimization`配置。

```js
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'async',
      name: false,
    },
    runtimeChunk: process.env.NODE_ENV !== 'production,
  }
};

mergeOptimization({
  splitChunks: {
    chunks: 'all'
  }
});

// 最终结果
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: process.env.NODE_ENV !== 'production,
  }
};


```

### mergeWebpackResolveFallback

webpack 5 不再自动 polyfill Node.js 的核心模块，这意味着如果你在浏览器或类似的环境中运行的代码中使用它们，你必须从 NPM 中安装兼容的模块，并自己包含它们。以下是 webpack 在 webpack 5 之前使用过的 polyfill 包列表：

```js
module.exports = {
  override(
    mergeWebpackResolveFallback({
      assert: require.resolve('assert'),
      buffer: require.resolve('buffer'),
      console: require.resolve('console-browserify'),
      constants: require.resolve('constants-browserify'),
      crypto: require.resolve('crypto-browserify'),
      domain: require.resolve('domain-browser'),
      events: require.resolve('events'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      punycode: require.resolve('punycode'),
      process: require.resolve('process/browser'),
      querystring: require.resolve('querystring-es3'),
      stream: require.resolve('stream-browserify'),
      string_decoder: require.resolve('string_decoder'),
      sys: require.resolve('util'),
      timers: require.resolve('timers-browserify'),
      tty: require.resolve('tty-browserify'),
      url: require.resolve('url'),
      util: require.resolve('util'),
      vm: require.resolve('vm-browserify'),
      zlib: require.resolve('browserify-zlib'),
    })
  )
}
```

如果强制不支持 node polyfill，可以考虑设置为`false`.

```js
module.exports = {
  override(
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
    })
  )
}
```
