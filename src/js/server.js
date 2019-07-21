var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server,
wss = new WebSocketServer({port: 8080});
var clientSockets=new Map();
const uuidv4 = require("uuid/v4");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


function wsSend(time,writer,value,toWho) {
	if (clientSockets.get(toWho)!=undefined){
		var wsWho=clientSockets.get(toWho);
			console.log(clientSockets.keys());
			
		 if(wsWho.readyState === WebSocket.OPEN) {
		 	
		 wsWho.send(JSON.stringify({
		 "time": time,
		 "writer": writer,
		 "value": value,
		 "toWho":toWho
		 		}));
		 };

	};
 };


wss.on('connection', function(ws) {
	console.log("connected new WebSocket");

	var register=false;

 	ws.on('message', function(message) {
 		console.log("get message "+message);
 		message=JSON.parse(message);

 		if ((message.writer=="anon")&&(!register)){
 			message.writer=uuidv4();
 		 	clientSockets.set(message.writer,ws);
 		 	register=true;
 		}
 		else{wsSend(message.time,message.writer,message.value,message.toWho);};
 		addToDB();
	});
});

function addToDB(){

};

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tschat");
  
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
});



 
 /*clientSocket.on('close', function() {
 closeSocket();
 });

 process.on('SIGINT', function() {
	 console.log("Closing things");
	 closeSocket('Server has disconnected');
	 process.exit();
 });*/