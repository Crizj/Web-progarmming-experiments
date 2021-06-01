var userModel = require('../lib/mysql');
var Imap = require('./../router/imap')

module.exports = 
{
    async signup(ctx) 
    {
        console.log(ctx.request.body)
        var user = 
        {
            email: ctx.request.body.email,
            pass: ctx.request.body.pass,
            reciever: ctx.request.body.reciever,
            recport: ctx.request.body.recport,
            sender: ctx.request.body.sender,
            sendport: ctx.request.body.sendport
        }
        let flag = 0;
        await userModel.findUserByEmail(user.email)
            .then(result => {
                console.log(result)
                if (result.length) {
                    //处理err
                    console.log('用户已存在')
                    ctx.body = {
                        code: 1
                    };                 
                } else if ( user.pass == '') {
                /* 
                    这里的错误处理放到前端更好
                    需要保证邮箱地址、授权码、端口等输入不为空
                    还要能用
                */
                    ctx.body = {        
                        code: 2
                    };

                } else {
                    flag = 1;             
                }
            })
        if(flag==1){
            let res = await  userModel.insertData([user.email, user.pass,
            user.reciever,user.recport,user.sender,user.sendport])
            await  userModel.findUserByEmail(user.email)
            .then((result)=>{
                // console.log(result[0]['avator'])
                ctx.session.id = res.insertId;
                ctx.session.user = user.email;
                ctx.session.pass = user.pass;
                ctx.session.reciever = user.reciever;
                ctx.session.recport = user.recport;
                ctx.session.sender = user.sender;
                ctx.session.sendport = user.sendport;
                Imap.getimap(ctx);

                ctx.body = {
                    code: 3
                };
                console.log('注册成功')
            })
        }
    },
    async signin(ctx)
    {
        console.log(ctx.request.body)
        var email = ctx.request.body.email;
        var pass = ctx.request.body.pass;

        await userModel.findUserByEmail(email)
        .then(result => {
            var res = JSON.parse(JSON.stringify(result))
            if (email === res[0]['email']&&(pass === res[0]['pass'])) {
                    console.log('登录成功')
                    ctx.body = {
                        code: 1,
                    }
                    ctx.session.user = res[0]['email']
                    ctx.session.id = res[0]['id']
                    ctx.session.pass = res[0]['pass']
                    ctx.session.reciever = res[0]['reciever']
                    ctx.session.recport = res[0]['recport']
                    ctx.session.sender = res[0]['sender']
                    ctx.session.sendport = res[0]['sendport']
                    // ctx.session.avator = res[0]['avator']
            }else if(pass != res[0]['pass']){
                ctx.body = {
                    code: 2 //授权码错误
                }
                ctx.session = null;
                ctx.redirect('/');
                console.log('授权码错误！');
            }
        }).catch(err => {
            ctx.session = null;
            ctx.body = {code: 3};
            ctx.redirect('/');
            console.log(err+ '完了！');
        })
    },
    async signout(ctx)
    {
        ctx.session = null;
        console.log('退出成功');
        ctx.body = true;
        ctx.redirect('/');
    }
}