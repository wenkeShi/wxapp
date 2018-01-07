const Model = require('../dao/model');
const sessions = require('./session');

const UserModel = Model.UserModel;

module.exports = (req, res, next) => {
	// let code = req.query.code;
// 	DATA.js_code = code;
// 	OPTION.path = PATH + queryString.stringify(DATA);
// 	let wxReq = https.request(OPTION, (res) => {
	// console.log('request wxopenid');
	// if(res.statusCode == 200){
	// 	console.log(Object.keys(res));
		// console.log(res.bady);
		// let json = '';

		// res.on('data',(data) => {
		// 	json+=data;
		// });

		// res.on('end',() => {
		// 	json = JSON.parse(json);
		// 	console.log(json);

			//user集合模式
			// let userSchema = new mongoose.Schema({
			// 	openId : {type: String},
			// });
			// let UserModel = mongoose.model('user',userSchema);
			let sessionId = req.headers.sessionid;
			let openId = sessions[sessionId];
			console.log('sessions----------------'+sessions[sessionId]);
			UserModel.find({openId:openId}, (err,results) => {
				if(results.length == 0){
					  let user = new UserModel();
					  user.openId = openId;
					  user.save((err) => {
					  	console.log('save an user success!');
					  });
				}else{
					console.log('user had exist');
				}
			});

			res.status(200).end();
			next();
			// let sessionSchema = new mongoose.Schema({
			// 	sessionId : {type:String},
			// 	time: {type: Date , default: Date.now}
			// 	validTime : {type: Number, default: 7200}
			// }); 
			// let SessionModel = mongoose.model('session',sessionSchema);
			// SessionModel.find((err, sessions) => {
			// 	console.log(sessions);
			// });			
			// let instance = new SessionModel();
			// instance.sessionId = json.openid + json.session_key;
			// instance.save((err) => {
			// 	console.log(err);
			// });
	// 	});
	// }
	// });
	// wxReq.end();
	// console.log(queryString.stringify(DATA));
	//wxReq.write(queryString.stringify(data));
	// res.status(200).send('ok');
};