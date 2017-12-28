const WebSocket = require('ws');
const login = require('../routes/login');
// const  router = login.router;
let  sessions = login.sessions;



module.exports = (httpServer) => {

	const wss = new WebSocket.Server({server : httpServer});

	wss.on('connection',(ws, req) => {
			let sessionId = queryString.parse(URL.parse(req.url).query).sessionId;
			ws.id = sessionId;
	    console.log('someone connect');
	    console.log(wss.clients);
	    wss.clients.forEach((client) => {
	    	console.log(Object.keys(client));
	    });

	    ws.on('message' , (msg) => {
	    		let msgObj = JSON.parse(msg);
	    		if(sessions[msgObj.targetId]){
	    			wss.clients.forEach((client) => {
					if(client.id === msgObj.targetId){
						let data = {
							time : msgObj.time,
							borrower :msgObj.nickName, 
							book :msgObj.bookName,
							borrowerId : sessions[sessionId],
							bookId : msgObj.bookId,
							wxNum : msgObj.wxNum,
							phoneNum : msgObj.phoneNum,
							msg : msgObj.msg
						};
						client.send(JSON.stringify(data));
					}
				});
	    		}
	        console.log(msg);
					//ws.send('you send '+msg);
	    });
	    //ws.send('hello');
	});
};