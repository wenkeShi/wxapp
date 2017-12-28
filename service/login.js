const sessions = {};


module.export = (req, res, next) => {
	let sessionId = req.headers.sessionid;
	if(sessionId){
		console.log(sessions[sessionId]);
		sessions[sessionId] = sessionId;
		next();
	}else{
		console.log('no sessionid');
		let code = req.query.code;
		console.log(code );
		let otherRes = res;
		DATA.js_code = code;
		OPTION.path = PATH + queryString.stringify(DATA);
		let wxReq = https.request(OPTION, (res) => {
			if(res.statusCode == 200){
				let json = '';
				res.on('data' , (data) => {
					json+=data;
				});
				res.on('end' , () => {
					console.log(json);
					json =JSON.parse(json);
					let openId = json.openid;
					sessions[openId] = openId;
					console.log(openId);
					otherRes.type('application/json');
					otherRes.json({
						data : {'sessionId' : openId},
					});
					otherRes.status(200);
				});
			}
		});
		wxReq.end();
};