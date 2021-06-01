const nodemailer = require('nodemailer')


async function sendMail(ctx,title,to,content) {
	let conf = {
		host: ctx.session.sender,
		port: ctx.session.sendport,
		secure:true,
		auth: {
			user: ctx.session.user,
			pass: ctx.session.pass //授权码 
		}
	};
	console.log(content);
	let transporter = nodemailer.createTransport(conf);
	let data = {
		from: ctx.session.user, // 发送者  
		to: to, // 接受者,可以同时发送多个,以逗号隔开  
		subject: title, // 标题  
		html: content
	};
	return new Promise((resolve, reject) => {
		transporter.sendMail(data, function(err, info) {
			if (err) {
				console.log(err);
				reject(0); //失败
				console.log('conf');
			}
			resolve(1); //成功
		})
	})
}

module.exports = {
	// async send(ctx,title,to,content) {
	// 	let result = await sendMail(ctx,title,to,content)
	// 	// ctx.body = result
	// 	console.log(result)
	// }
	sendMail,
}