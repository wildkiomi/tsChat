var ws = new WebSocket("ws://localhost:8080");
ws.onopen=function(e){console.log("connected to server")};

var url='https://wildkiomichat.firebaseio.com';
var database = new Firebase(url);
var userList=document.getElementById("usersList");
var userHistory=document.getElementById("dialog");
downloadDb();
var currentUserName;
var messages=document.getElementById("message");

function getRealTime() {
  var date = new Date();
  return date.getHours() + ":" + date.getMinutes();
};

function downloadDb(){
	fetch(url+'/users.json').then(res=>res.json())
  	.then(function(users){
	  	for (user in users){
		  	var userDiv=document.createElement("div");
		  	userDiv.classList.add("userDiv","bg-primary");
		  	userDiv.innerHTML='<span class="badge badge-pill badge-success">'+user+'</span><span class="badge badge-light">9</span>';
		  	userDiv.id=user;
		  	usersList.appendChild(userDiv);
	 	}; 
  	})
};

usersList.addEventListener("click",function(event){
	currentUserName=event.target.id.toString();
	userHistory.innerHTML="";
	downloadHistory(currentUserName);
});

function downloadHistory(name){
	fetch(url+'/users/'+name+'/history.json').then(res=>res.json())
  	.then(function(history){
	  	for (element in history){
	  		fetch(url+'/users/'+name+'/history/'+element+'.json').then(res=>res.json())
	  		.then(function(message){
	  			printMessage(message.time,message.writer,message.value);
	  		})	
	  		.then(currentUserWs=message.toWho); 	
	 	};
  	})
};

document.getElementById("submitButton").addEventListener("click", sendMessage);

function sendMessage(){
	newMessage = messages.value;
  	messages.value="";
  	var time=getRealTime();
  	if(ws.readyState === WebSocket.OPEN) 
  		{ws.send(JSON.stringify({"time":time,"writer":"operator","value":newMessage,"toWho":currentUserName}));};
  printMessage(time,"you",newMessage);
};

function printMessage(time,writer,value){
	var userDiv=document.createElement("div");
	userDiv.classList.add("userDiv","badge-primary","badge","text-wrap");
	userDiv.innerHTML='<span class="badge badge-warning">'+time+'</span> <span class="badge badge-success">'+writer+'</span> '+value;
	userHistory.appendChild(userDiv);
};

ws.onmessage = function(e){
   var message = JSON.parse(e.data);
   printMessage(message.time,message.writer,message.value);
 };


