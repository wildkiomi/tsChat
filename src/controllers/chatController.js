var processWs=require('./processWs.js');

exports.chatting = function(ws,req){
  processWs(ws,req);
};

exports.operatorChat = function(ws,req){
  processWs(ws,req);
};
