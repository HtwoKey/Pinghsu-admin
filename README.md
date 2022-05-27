# htwokey-admin

## 简介
pinghsu-admin 是基于[vue-element-admin](https://panjiachen.github.io/vue-element-admin) 开发的一个博客后台管理界面。

**该项目不支持低版本浏览器(如 ie)，有需求请自行添加 polyfill [详情](https://github.com/PanJiaChen/vue-element-admin/wiki#babel-polyfill)**

## 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 、[vue-cli](https://github.com/vuejs/vue-cli) 、[axios](https://github.com/axios/axios) 和 [element-ui](https://github.com/ElemeFE/element)


## 前端技术
 
 技术 | 说明 | 官网
 ----|----|----
 Vue | 前端框架 | [https://vuejs.org/](https://vuejs.org/)
 Vue-router | 路由框架 | [https://router.vuejs.org/](https://router.vuejs.org/)
 Vuex | 全局状态管理框架 | [https://vuex.vuejs.org/](https://vuex.vuejs.org/)
 Element-ui | 前端UI框架 | [https://element.eleme.io/](https://element.eleme.io/)
 Axios | 前端HTTP框架 | [https://github.com/axios/axios](https://github.com/axios/axios)
 v-charts | 基于Echarts的图表框架 | [https://v-charts.js.org/](https://v-charts.js.org/)
 Js-cookie | cookie管理工具 | [https://github.com/js-cookie/js-cookie](https://github.com/js-cookie/js-cookie)
 vue-element-admin | 前端解决方案 | [https://panjiachen.github.io/vue-element-admin](https://panjiachen.github.io/vue-element-admin)

## 功能

```
- 登录 / 注销
- 文章管理
  - 文章列表
  - 添加
  - 删除
  - 修改
  - 评论开关
  - 状态管理

- 文章分类管理
  - 分类列表
  - 添加
  - 删除
  - 修改

- 标签管理

- 评论管理

- 访问日志

- 请求日志
```


## 开发

```bash
# 克隆项目
git clone 

# 进入项目目录
cd vue-element-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## License

[MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE)

Copyright (c) 2022-present htwokey
