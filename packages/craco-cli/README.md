# craco-cli

> **C**reate **R**eact **A**pp **C**onfiguration **O**verride. 零配置启动`react app`.

## Usage

```bash

npm create craco-cli my-app
cd my-app

```

成功创建项目后，包含如下内置命令

### `npm run start`

本地开发模式下启动服务器， 默认运行 http://localhost:3000。 如需自定义设置打开的 URL 以及配置代理，支持下面参数方式更改。

```bash
npm start
```

> 以上命令运行的方式，都是一次性执行的参数配置，如果想长久生效，可以在项目的`.env`文件中进行持久化配置。

```bash

### .env

PORT=443 # 自定义设置端口
HOST=https://xx.com # 自定义设置打开的URL
HTTPS=true # 支持HTTPS代理

```

### `npm run build`

在默认的压缩情况下，支持 dll 配置，对于加速启动速度和命中缓存有很大提升，默认已经集成到 start 和 build 命令中

### `npm run test`

执行测试命令
