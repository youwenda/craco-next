# `customize-cra-extra`

> This project provides a set of utilities to customize [`create-react-app`](https://github.com/facebook/create-react-app) versions 4 or 5 configurations

## Usage

**Note:** See the [api docs](http://github.com/youwenda/craco-next/blob/master/packages/customize-cra-extra/api.md) for documentation for each function.

## ChangeLog

### 3.0.1

- feat: 升级`react-scripts@5.0.1`。

### 3.0.0

- 1、feat: 兼容`react-scripts@5.0.1-next.58` 版本。
- 2、feat: 使用`lerna` + `yarn workspaces` 管理多包发布。
- 3、feat: 增加`mergeWebpackResolveFallback` 方法。
- 4、fix: 修复`build`命令错误引用`publicPath`的问题。
- 5、feat: `DeprecationWarning: 'https' option is deprecated. Please use the 'server' option.`
- 6、fix: `addMultipleEntries` 方法参数恢复 1.x 版本
- 7、feat: `html-webpack-plugin` 变更默认的 `scriptLoading` 为 `blocking`.
- 8、fix: `webpack-inject-plugin` 升级 `webpack5` 去掉`entryName` 属性。