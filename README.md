#### 简介

本项目为南京大学计算机科学与技术系 网络应用开发技术 课程设计。

本项目是一个web邮箱，基于koa2+nodejs+bootstrap+ejs。

本项目参考了以下项目：

基于koa的发送邮件demo：https://github.com/qhbin/koa-mail

基于node-koa2-bootstrap开发的一个微型前端论坛：https://github.com/Jay214/myblog-koa2

虽然有很多bug，但很显然，原作者是一个很懒且对前端不太感兴趣的家伙。因此他决定不会更新维护本邮箱或是尝试处理各种异常。

#### 使用方法:

```
git clone 本项目地址

npm install 

node app.js
```

默认端口3000.

注意：package.json 里面的依赖包不全，在 npm install的时候一定会报错，请自行安装缺少的模块...原作者这边后来手动装的东西不少，因此忘记了要添加哪些东西(别骂了别骂了)...但问题不大嘛欸嘿嘿(q(≧▽≦q))

#### 主要功能：

收发邮件。因为显然没有服务器，所以在注册的时候请保证所有配置都是正确的(注册成功之后网页上没有办法修改...请尝试直接update数据库)。

本邮箱使用IMAP/SMTP协议代理原邮箱。

邮箱配置包括邮箱地址、授权码(请在对应邮箱内做好相应配置)、imap服务器地址及端口号、SMTP服务器地址及端口号。注册成功之后，源代码默认从服务器拉取2020年某月某日之后的邮件，如需修改请自行查阅...对于收到新邮件，该web邮箱没有一直监听新邮件，所以需要手动刷新，请点击右上角的邮件图标，点击下拉栏中的"收件"以刷新收件箱。

对了，邮件的展示我并没有排序...体谅一下(别骂了别骂了)...最上面的不一定是最新的邮件。





