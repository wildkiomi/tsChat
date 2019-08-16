var express = require('express');
var app = express();
const mongoose = require("mongoose");
const expressHbs = require("express-handlebars");
var bodyParser = require('body-parser');
const hbs = require("hbs");
var expressWs = require('express-ws')(app);

app.engine("hbs", expressHbs(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))

app.use(express.static(__dirname + "/static"));

app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "/views/partials");

const userRouter = require("./routes/userRouter.js");
const homeRouter = require("./routes/homeRouter.js");
const messageRouter = require("./routes/messageRouter.js");
const chatRouter=require("./routes/chatRouter.js");

app.use("/chat",chatRouter); 
app.use("/users", userRouter);
app.use("/message", messageRouter);
app.use("/", homeRouter);

app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true }, function(err){
    if(err) return console.log(err);
    app.listen(8080, function(){
        console.log("Server is ready");
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