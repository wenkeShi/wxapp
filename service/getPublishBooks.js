const sessions = require('./session');
const UserModel = require('../dao/model').UserModel;


module.exports = (req, res, next) => {
	let sessionId = req.headers.sessionid;
	let openid = sessions[sessionId];
	UserModel.findOne({openId : openid} , (err, user) => {
		// res.type('application/json');  用res.json可省略这步
		//res.json({
		//	publishedBooks : results[0].publishedBooks
		//});
		//res.status(200).end();    //res.end()用于不带数据的快速返回请求 如果要带数据，用res.json 或者res.send
		res.status(200).json({
			publishedBooks : user.publishedBooks 
		});
		next();       //next()一定是在异步处理完之后调用        
	});
	//next() 这里用next的话会在查找的异步结果返回之前就执行next,这就可能导致查找结果返回前服务器就已经返回响应数据了。
}