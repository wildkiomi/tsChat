var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server,
wss = new WebSocketServer({port: 8080});
var clientSockets=new Map();

function wsSend(time,writer,value,toWho) {
	if (clientSockets.get(toWho)!=undefined){
		var wsWho=clientSockets.get(toWho);
			
		 if(wsWho.readyState === WebSocket.OPEN) {
		 	
		 wsWho.send(JSON.stringify({
		 "time": time,
		 "writer": writer,
		 "value": value,
		 "toWho":toWho
		 		}));
		 console.log("sent");
		 };
		 

	};

	
};


wss.on('connection', function(ws) {
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
});

 		/*if ((message.writer=="anon")&&(!register)){
 			message.writer=uuidv4();
			var user=new User({
				name: message.writer,
				id: message.writer
			});
			user.save(function(err){
				if (err) throw err;
					console.log(arguments);
			});



 		 	clientSockets.set(message.writer,ws);
 		 	register=true;
 		}
 		else if ((message.writer!="anon")&&(!register)){
 			auth(message.writer);
 			clientSockets.set(message.writer,ws);
			register=true;
 		}
 		else if ((message.writer=="operator")&&(register)){
 			}
 		else{
 			addToDb(message.time,message.writer,message.value,message.toWho);*/

 			


/*function addToDb(time,writer,value,toWho){
	var message=new History({
		time: time,
		writer: writer,
		value: value,
		toWho: toWho
	});
	message.save(function(err){
				if (err) throw err;
					console.log(arguments);
			});
};*/

/*function auth(username){
	var user=new User({
				name: username,
				id: uuidv4()
			});
	user.save(function(err){
		if (err) throw err;
			console.log(arguments);
		});
	if (username=="operator") sendDb();


};
	*/


 
 /*clientSocket.on('close', function() {
 closeSocket();
 mongoose.disconnect();
 });

 process.on('SIGINT', function() {
	 console.log("Closing things");
	 closeSocket('Server has disconnected');
	 process.exit();
 });*/

/*const uuidv4 = require("uuid/v4");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tschat', {useNewUrlParser: true});
var User=require("./user");
var History=require("./history");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  
});*/

/*var actionsWithDb=new Map();
	actionsWithDb.set("sendDb", sendDb);
	actionsWithDb.set("sortByName", sortByName);*/
	//actionsWithDb.set("sendDb", sendDb);
/*
var url='https://wildkiomichat.firebaseio.com';
var database = new Firebase(url);*/