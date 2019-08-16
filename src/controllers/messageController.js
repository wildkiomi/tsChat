const Message=require("../models/message.js");

exports.deleteMessage = function (request, response){
    response.send("Delete message");
};
exports.addMessage = function (ws, req){
    var message = new Message(request.body);
  	message.save((err) =>{
    if(err)
      sendStatus(500);
    res.sendStatus(200);
  })
  	 ws.on('message', function(msg) {
    ws.send(msg);
  });
};

exports.getMessages = function(request, response){
    response.render("messages.hbs",{
    	title:"Messages",
    	linkToCss:""
    });
};