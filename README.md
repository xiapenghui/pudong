# direwolf-vue

#### Description
应用开发平台前端工程

#### Software Architecture
Software architecture description

#### Installation

1. 运行`npm install`安装工程
2. 修改`public/common-assets/json/config.json`配置文件配置系统参数
    ```
    {
      "version": 0.1,
      "siteName": "Direwolf",
      "minSiteMame": "D+",
      "showErrorTips": true,
      "defaultTheme": "#2f4050",
      "requestTimeout": 30000,
      "serverPort": 8888, // 修改为webpack server启动端口
      "productionSourceMap": true,
      "backServerType": "soa",
      "backServerRoot": "http://192.168.21.67:8080/direwolf-app", // 修改为后端服务器根路径
      "parentDirectory": "E:/Repository/direwolf-cloud-separation/", // 修改为编译发布目录
      "projectContext": "/direwolf-app" // 修改为系统上下文
    }
    ```
3. 运行`npm run serve`启动工程，若浏览器未自动打开，请访问`localhost:8888/direwolf-app/admin/login`
1. 填入任意用户名密码，点击登录即可进入工程页面


#### Development Instructions

1. 在src/pages下新建文件夹作为新模块的根目录
2. 新模块的html文件必须引入一下静态文件
   ```
    <script src="/common-assets/js/storageEvent.js"></script>
    <script src="/common-assets/plugins/crypto/aes.js"></script>
    <script src="/common-assets/plugins/crypto/AesUtil.js"></script>
    <script src="/common-assets/plugins/crypto/hmac-sha256.js"></script>
    <script src="/common-assets/plugins/crypto/pbkdf2.js"></script>
    <script src="/common-assets/plugins/crypto/pad-zeropadding.js"></script>
    ```
3. 新模块的main.js文件中必须添加`Vue.prototype.$$config = config`，其他按需参照admin内容增加
4. 新模块路由须使用history模式，router必须引用`utils.beforeEachRoute`方法进行权限校验和路径跳转，使用方法参照`sys/router/index.js`
6. 使用`http://localhost:8888/direwolf-app/模块名称`访问新模块，或者在`src\pages\admin\mock\common.js`中`getMenu`方法添加自定义页面路由即可在页面看到菜单
6. 参考admin模块添加自己的其他mock配置

