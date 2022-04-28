# New Generation For Craco scripts

# 前言

> 本文档阐述基于 `lerna` 和 `yarn workspaces` 模式的 monorepo 的项目开发。

由于`yarn` 和 `lerna` 在功能上有较多的重叠，项目中采用`yarn`官方推荐的做法，用`yarn`来处理依赖问题，用`lerna`来处理发布问题，能用`yarn`做的就用`yarn`来做。

## 准备步骤

首先确保全局安装 `yarn`、`lerna`

```bash
npm i -g yarn lerna
```

## 管理依赖

### 添加公共依赖

例如 `gulp`, `cross-env`, `eslint` 这种开发工具，应作为公共依赖安装在根项目下

```bash
# -W 参数的意思是安装在 workspaces 根目录下面
# 安装内网的包不要忘记配 tnpm 的 registry

yarn add -W -D gulp cross-env eslint
```

### 添加子项目独有的依赖

```bash
yarn workspace craco-cli add dayjs -S
```

### 添加子项目依赖的其他子项目

```bash
yarn workspace craco-cli add customize-cra-extra@^0.0.1
```

## 发布

```bash

# 先确定版本，完成 git 操作
lerna version

# 使用 npx 调用 @ali/lerna 完成发布
lerna publish from-git

```
