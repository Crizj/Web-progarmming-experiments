const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const routers = require('./router/index')
const koaStatic = require('koa-static')
const ejs = require('ejs')
const views = require('koa-views')
const path = require('path')
const session = require('koa-session-minimal')
const mysqlstore = require('koa-mysql-session')
const config = require('./configs/config.js')
const MysqlStore = require('koa-mysql-session')

const app = new Koa();

const sessionMysqlConfig = 
{
    user: config.database.USERNAME,
    password:config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

let cookie = 
{        // 存放sessionId的cookie配置
    maxAge: 360*12*1000, // cookie有效时长(ms)
    expires: '',  // cookie失效时间
    path: '', // 写cookie所在的路径
    domain: '', // 写cookie所在的域名
    httpOnly: true, // 是否只用于http请求中获取
    overwrite: true,  // 是否允许重写
}

app.use(bodyParser({
    'formLimit':'5mb',
    'jsonLimit':'5mb',
    'textLimit':'5mb'
}))

app
    .use(session({
        key: 'USER_SID',
        store: new MysqlStore(sessionMysqlConfig),
        cookie:cookie
    }))
    .use(koaStatic(path.join(__dirname,'./public')))
    .use(views(path.join(__dirname,'./views'),{extension:'ejs'}))
    .use(routers.routes()).use(routers.allowedMethods())
    .use(require('./router/write').routes())
    .use(require('./router/page').routes())



app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')
