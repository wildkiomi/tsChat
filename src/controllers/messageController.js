const Message=require("../models/message.js");

exports.deleteMessage = function (request, response){
    response.send("Delete message");
};
exports.addMessage = function (request, response){
    var message = new Message(request.body);
  	message.save((err) =>{
    if(err)
      sendStatus(500);
    res.sendStatus(200);
  })
};

exports.getMessages = function(request, response){
    response.render("messages.hbs",{
    	title:"Messages",
    	linkToCss:""
    });
};