var Imap = require('imap')
var simpleParser = require('mailparser').simpleParser;
var fs = require('fs')
const userModel = require('../lib/mysql');
const moment = require('moment');
var inspect = require('util').inspect;

module .exports = 
{
    async getimap(ctx)
    {
        let conf = {
            user: ctx.session.user,
            password: ctx.session.pass,
            host: ctx.session.reciever,
            port: ctx.session.recport,
            tls: true,
            tlsOptions: { rejectUnauthorized: false}
        };
        var imap = new Imap(conf);
        function openInbox(cb)
        {
            imap.openBox('INBOX',true,cb);
        }
        imap.once('ready', function() {

            openInbox(function(err, box) {
        
                console.log("打开邮箱")
        
                if (err) throw err;
        
                imap.search(['ALL', ['SINCE', 'May 20, 2020']], function(err, results) {//搜寻2017-05-20以后未读的邮件
        
                    if (err) throw err;
        
                    var f = imap.fetch(results, { bodies: '' });//抓取邮件（默认情况下邮件服务器的邮件是未读状态）
        
                    f.on('message', function(msg, seqno) {
        
                        msg.on('body', function(stream, info) {
                            simpleParser(stream)
                                .then(parsed =>{
                                    userModel.insertEmail([parsed.from.text,parsed.to.text,parsed.subject,parsed.html,2,ctx.session.id, parsed.date])
                                    .then((result)=>{
                                        console.log('插入数据库成功');
                                    }).catch((err)=>{
                                        console.log(err + '插入数据库失败');
                                    })
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                                
        
                        });
                        // msg.once('end', function() {
                        //     console.log(seqno + '完成');
                        // });
                    });
                    f.once('error', function(err) {
                        console.log('抓取出现错误: ' + err);
                    });
                    f.once('end', function() {
                        console.log('所有邮件抓取完成!');
                        imap.end();
                    });
                });
            });
        });
        
        imap.once('error', function(err) {
            console.log(err);
        });
        
        imap.once('end', function() {
            console.log('关闭邮箱');
        });
        
        imap.connect();
        
    }
}

// module.exports = {
//     async getimap(ctx)
//     {
//         let conf = {
//             user: ctx.session.user,
//             password: ctx.session.pass,
//             host: ctx.session.reciever,
//             port: ctx.session.recport,
//             tls: true,
//             tlsOptions: { rejectUnauthorized: false}
//         };
//         var imap = new Imap(conf);
//         function openInbox(cb)
//         {
//             imap.openBox('INBOX',true,cb);
//         }
//         imap.once('ready', function() {
//             openInbox(function(err, box) {
//             console.log("打开邮箱")
//             if (err) throw err;
//             imap.search(['UNSEEN', ['SINCE', 'May 20, 2020']], function(err, results) {//搜寻2017-05-20以后未读的邮件
//                 if (err) throw err;
           
//                 var f = imap.fetch(results, { bodies: '' });//抓取邮件（默认情况下邮件服务器的邮件是未读状态）
           
//                 f.on('message', function(msg, seqno) {
//                     var mailparser = new MailParser();
//                     // var prefix = '(#' + seqno + ') ';
//                     msg.on('body', function(stream, info) {
//                     // var buffer = '';
//                     // stream.on('data', function(chunk) {
//                     //     buffer += chunk.toString('utf8');
//                     // });
//                     // stream.once('end', function() {
//                     //     console.log('Parsed header: %s', inspect(Imap.parseHeader(buffer)));
//                     // });

                    
//                         // if (info.which === 'TEXT')
//                         //     console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
//                         // var buffer = '', count = 0;
//                         // stream.on('data', function(chunk) {
//                         //     count += chunk.length;
//                         //     buffer += chunk.toString('utf8');
//                         //     if (info.which === 'TEXT')
//                         //         console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
//                         // });
//                         // stream.once('end', function() {
//                         //     if (info.which !== 'TEXT')
//                         //         console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
//                         //     else
//                         //         console.log(prefix + 'Body [%s] Finished', inspect(info.which));
//                         // });
                            

//                     stream.pipe(mailparser);//将为解析的数据流pipe到mailparser
//                     var title = '';
//                     var from = '';
//                     var to = '';
//                     var content = '';
//                     var eid = 0;
//                     //邮件头内容
//                     mailparser.on("headers", function(headers) {
//                         title = headers.get('subject');
//                         from = headers.get('from').text;
//                         to = headers.get('to').text;
//                         console.log("邮件主题: " + title);
//                         console.log("发件人: " + from);
//                         console.log("收件人: " + to);
//                         
//                     });
           
//                     // //邮件内容
                    
//                     mailparser.on("data", function(data) {
//                       if(data.type === 'text') {//邮件正文
//                         //console.log("邮件内容: " + data.html);
//                         content = data.html;
//                       }
//                       console.log(eid);
//                     //   await userModel.UpdateEmail(content,res.insertId)
//                     //   .then(()=>{
//                     //         console.log('更新成功')
//                     //     }).catch((err)=>{
//                     //     console.log(err + '更新失败');
//                     //     })
//                     //   if (data.type === 'attachment') {//附件
//                     //     console.log("邮件附件信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//                     //     console.log("附件名称:"+data.filename);//打印附件的名称
//                     //     data.content.pipe(fs.createWriteStream(data.filename));//保存附件到当前目录下
//                     //     data.release();
//                     //   }
                        
//                     });
//                     //type-1:已发送; 0-发送失败，存为草稿(?) 2-已接受

                    
//                   });
    
//                 });
//                 f.once('error', function(err) {
//                   console.log('抓取出现错误: ' + err);
//                 });
//                 f.once('end', function() {
//                   console.log('所有邮件抓取完成!');
//                   imap.end();
//                 });
//             });
//             });
//         });
    
//         imap.once('error', function(err) {
//             console.log(err);
//         });
           
//         imap.once('end', function() {
//             console.log('关闭邮箱');
//         });
           
//         imap.connect();
//     }
// }

// imap.once('ready', function() {
//     openInbox(function(err, box) {
//       if (err) throw err;
//       var f = imap.seq.fetch('1:3', {
//         bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
//         struct: true
//       });
//       f.on('message', function(msg, seqno) {
//         console.log('Message #%d', seqno);
//         var prefix = '(#' + seqno + ') ';
//         msg.on('body', function(stream, info) {
//           var buffer = '';
//           stream.on('data', function(chunk) {
//             buffer += chunk.toString('utf8');
//           });
//           stream.once('end', function() {
//             console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
//           });
//         });
//         msg.once('attributes', function(attrs) {
//           console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
//         });
//         msg.once('end', function() {
//           console.log(prefix + 'Finished');
//         });
//       });
//       f.once('error', function(err) {
//         console.log('Fetch error: ' + err);
//       });
//       f.once('end', function() {
//         console.log('Done fetching all messages!');
//         imap.end();
//       });
//     });
//   });

// openInbox(function(err, box) {
//     if (err) throw err;
//     var f = imap.seq.fetch(box.messages.total + ':*', { bodies: ['HEADER.FIELDS (FROM)','TEXT'] });
//     f.on('message', function(msg, seqno) {
//       console.log('Message #%d', seqno);
//       var prefix = '(#' + seqno + ') ';
//       
//       msg.once('attributes', function(attrs) {
//         console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
//       });
//       msg.once('end', function() {
//         console.log(prefix + 'Finished');
//       });
//     });
//     f.once('error', function(err) {
//       console.log('Fetch error: ' + err);
//     });
//     f.once('end', function() {
//       console.log('Done fetching all messages!');
//       imap.end();
//     });
//   });