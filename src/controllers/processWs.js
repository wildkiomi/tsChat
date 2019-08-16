var wsSend=require('./sendMessage.js');
var clientSockets=require('../models/socketsMap.js');

module.exports=function processWs(ws,req){
console.log("connected new WebSocket");
	var register=false;
 	ws.on('message', function(message) {
 		console.log("get message "+message);
 		message=JSON.parse(message);

 	if (!register){
 		 	clientSockets.set(message.writer,ws);
 		 	register=true;
 		}
 	else{
 			wsSend(message.time,message.writer,message.value,message.toWho);
 		}
	});

	ws.on('close', function() {
        console.log('The connection was closed!');
    });

};