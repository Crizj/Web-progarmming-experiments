const router = require('koa-router')();
const userModel = require('../lib/mysql');
const moment = require('moment');
const mailer = require('./../controllers/mail')


router.get('/write', async(ctx,next)=>{
    if(!ctx.session.user)
    {    //检查是否登录
        ctx.redirect('/')
        return false;
    }
    await ctx.render('write',{
        session:ctx.session,
    })
})
    //发表文章

router.post('/write',async(ctx,next)=>{
 // console.log(ctx.request.body.content)
    let email = {
        title : ctx.request.body.title,
        from: ctx.session.user,
        to: ctx.request.body.to,
        content : ctx.request.body.content,
        author : ctx.session.user,
        time : moment().format('YYYY-MM-DD HH:mm'),
        uid : ctx.session.id,
    }
    // console.log(email);
    let result = await mailer.sendMail(ctx,email.title,email.to,email.content);
    console.log(result);
    let type = result; 
    // (f,t,title,content,type,uid,moment)
    //type-1:已发送; 0-发送失败，存为草稿(?)
    await userModel.insertEmail([email.from,email.to,email.title,email.content,type,email.uid,email.time])
        .then(()=>{
            ctx.body = 1;
            console.log('插入数据库成功')
        }).catch((err)=>{
            console.log(err);
            ctx.body = 0;
        })
    
})
//删除文章
// router.get('/delete',async(ctx,next)=>{
//     let articleId = ctx.query.id;
//     console.log(articleId)
//     await userModel.deletePost(articleId)
//         .then(()=>{
//             ctx.redirect('/home');
//             console.log('删除成功')
//         }).catch(err=>{
//             console.log(err)
//             ctx.body = false;
//         })
// })


//评论分页
//  router.post('/article/:articleId/commentPage', async(ctx,next)=>{
//      let articleId = parseInt(ctx.params.articleId),
//         page = parseInt(ctx.request.body.page);
//         console.log(articleId,page)
//         await userModel.findCommentByPage(page,articleId)
//             .then(result=>{
//                 ctx.body = result;
//                 console.log(result);
//             }).catch(err=>{
//                 ctx.body = 'error';
//                 console.log(err);
//             })
//  })

 
module.exports = router; 