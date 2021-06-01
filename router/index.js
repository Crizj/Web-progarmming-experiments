const router = require('koa-router')()
// const mail = require('./mail')
const mailController = require('./../controllers/mail')
const signuper = require('./../controllers/signup')
const writer = require('./write')
const fs = require('fs')
const mailparser = require('mailparser')
const userModel = require('../lib/mysql');
var Imap = require('./../router/imap')

router.get('/', async ( ctx )=>{
  if(!ctx.session.user)
  {
    emailLength = 0;
    email = {};
  }
  else
  {
    let _sql = `select * from emails where uid = "${ctx.session.id}" and type = 2 limit 0,10`;
    await userModel.query(_sql)
      .then(result=>{
        email = result;
      })
    _sql = `select * from emails where uid = "${ctx.session.id}" and type = 2`;
    await userModel.query(_sql)
      .then(result=>{
        emailLength = result.length;
      })

  }
  await ctx.render('home', {
    session: ctx.session,
    sub: 'rec',
    emails: email,
    emailLength: emailLength,
    emailPageLength: Math.ceil(emailLength / 10),
  });
})

router.get('/fresh', async ( ctx )=>{
  if(!ctx.session.user)
  {
    emailLength = 0;
    email = {};
  }
  else
  {
    userModel.deleteALLEmail();
    Imap.getimap(ctx);
    ctx.redirect('/');
  }
})

router.post('/rec/page', async(ctx, next) => {
  let page = ctx.request.body.page;
    await userModel.findEmailByPage(ctx.session.id,2,page)
      .then(result=>{
          ctx.body = result   
      }).catch(()=>{
      ctx.body = false;
  })  
  
})

router.post('/signup',signuper.signup)
router.post('/signin',signuper.signin)
router.get('/signout',signuper.signout)
// router.get('/check',mailController.check)
// router.get('/send',mailController.send)
// router.use('/mail', mail.routes(), mail.allowedMethods())

module.exports = router