const router = require('koa-router')();
const userModel = require('../lib/mysql');
const imap = require('imap');
router.get('/rec/:emailID',async(ctx,next)=>{
    if(!ctx.session.user)
    {
        ctx.redirect('/');
        return false;
    }
    let emailID = ctx.params.emailID;
    let email;
    await userModel.findEmailByEid(emailID)
        .then(result=>{
            email = result;
        }).catch(err=>{
            console.log(err);
            ctx.redirect('/');
        })
    await ctx.render('email',{
        session: ctx.session,
        option: 'delete',
        display: '删除',
        email:email[0],
    });
})

router.get('/del/:emailID',async(ctx,next)=>{
    if(!ctx.session.user)
    {
        ctx.redirect('/');
        return false;
    }
    let emailID = ctx.params.emailID;
    let email;
    await userModel.findEmailByEid(emailID)
        .then(result=>{
            email = result;
        }).catch(err=>{
            console.log(err);
            ctx.redirect('/');
        })
    await ctx.render('email',{
        session: ctx.session,
        option: 'realdel',
        display: '彻底删除',
        email:email[0],
    });
})

router.get('/realdel',async(ctx,next)=>{
    let id = ctx.query.id;
    //type-1:已发送; 0-发送失败，存为草稿(?);2-收件;3-已删除
    await userModel.deleteEmail(id)
        .then(()=>{
            ctx.redirect('/');
            console.log('已彻底删除！');
        }).catch(err=>{
            ctx.redirect('/');
            console.log(err + '删除失败！');
        })
    
})

router.get('/deleted',async(ctx,next)=>{
    if(!ctx.session.user)
    {
        ctx.redirect('/');
        return false;
    }
    emailLength = 0;
    email = {};
    let _sql = `select * from emails where uid = "${ctx.session.id}" and type = 3 limit 0,10`;
    await userModel.query(_sql)
      .then(result=>{
        email = result;
      })
    _sql = `select * from emails where uid = "${ctx.session.id}" and type = 3`;
    await userModel.query(_sql)
      .then(result=>{
        emailLength = result.length;
      })
    await ctx.render('home', {
        session: ctx.session,
        sub: 'del',
        emails: email,
        emailLength: emailLength,
        emailPageLength: Math.ceil(emailLength / 10),
    });
})

router.get('/sent/:emailID',async(ctx,next)=>{
    if(!ctx.session.user)
    {
        ctx.redirect('/');
        return false;
    }
    let emailID = ctx.params.emailID;
    let email;
    await userModel.findEmailByEid(emailID)
        .then(result=>{
            email = result;
        }).catch(err=>{
            console.log(err);
            ctx.redirect('/');
        })
    await ctx.render('email',{
        session: ctx.session,
        option: 'delete',
        display: '删除',
        email:email[0],
    });
})

router.get('/out',async(ctx,next)=>{
    if(!ctx.session.user)
    {
        ctx.redirect('/');
        return false;
    }
    emailLength = 0;
    email = {};
    let _sql = `select * from emails where uid = "${ctx.session.id}" and type = 1 limit 0,10`;
    await userModel.query(_sql)
      .then(result=>{
        email = result;
      })
    _sql = `select * from emails where uid = "${ctx.session.id}" and type = 1`;
    await userModel.query(_sql)
      .then(result=>{
        emailLength = result.length;
      })
    await ctx.render('home', {
        session: ctx.session,
        sub: 'sent',
        emails: email,
        emailLength: emailLength,
        emailPageLength: Math.ceil(emailLength / 10),
    });
})

router.get('/delete',async(ctx,next)=>{
    let id = ctx.query.id;
    //type-1:已发送; 0-发送失败，存为草稿(?);2-收件;3-已删除
    await userModel.MoveEmailType(3,id)
        .then(()=>{
            ctx.redirect('/');
            console.log('删除成功');
        }).catch(err=>{
            ctx.redirect('/');
            console.log(err + '删除失败！');
        })
    
})
module.exports = router
