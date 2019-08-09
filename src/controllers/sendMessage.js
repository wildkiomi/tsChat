var clientSockets=require('./socketsMap.js');
module.exports=function wsSend(time,writer,value,toWho) {
	if (clientSockets.get(toWho)!=undefined){
		var wsWho=clientSockets.get(toWho);
			
		 wsWho.send(JSON.stringify({
		 "time": time,
		 "writer": writer,
		 "value": value,
		 "toWho":toWho
		 		}));
		 console.log("sent");

	};
	
};