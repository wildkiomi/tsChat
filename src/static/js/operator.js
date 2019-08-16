var ws = new WebSocket("ws://localhost:8080/chat/operator");
var order="";

ws.onopen=function(e){
	console.log("connected to server");
	ws.send(JSON.stringify({"time":getRealTime(),"writer":"operator","value":"connected"}))
};

var url='https://wildkiomichat.firebaseio.com';
var database = new Firebase(url);
var userList=document.getElementById("usersList");
var userHistory=document.getElementById("dialog");
var divSearch=document.getElementById("divSearch");
var userSearch;
var currentUserName;
var messages=document.getElementById("message");
var label1=document.getElementById("label1");
var label2=document.getElementById("label2");
var label3=document.getElementById("label3");
var param1=document.getElementById("param1");
var param2=document.getElementById("param2");
var param3=document.getElementById("param3");
var commandLog=document.getElementById("commandLog");
var run=document.getElementById("run");
run.addEventListener("click",function(e){
	configureCommand();
});

function getRealTime() {
  var date = new Date();
  return date.getHours() + ":" + date.getMinutes();
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
	  		fetch(url+'/users/'+name+'/history/'+element+'.json')
	  		.then(res=>res.json())
	  		.then(function(message){
	  			printMessage(message.time,message.writer,message.value);
	  		})	 	
	 	};
  	})
};

function sortUsers(){
	var sortForm=document.forms.sortForm;
	var sortValue=sortForm.elements.sort.value;
	
	switch(sortValue){
		case "a-j":
			order='?orderBy="$key"&startAt="a"&endAt="j"';
			break;
		case "k-q":
			order='?orderBy="$key"&startAt="k"&endAt="q"';
			break;
		case "r-z":
			order='?orderBy="$key"&startAt="r"&endAt="z"';
			break;
	};
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
	userDiv.innerHTML='<span class="badge badge-primary text-wrap"><span class="badge badge-warning">'+time+'</span> <span class="badge badge-success">'+writer+'</span> '+value+'</span>';
	userHistory.appendChild(userDiv);
};

ws.onmessage = function(e){
   var message = JSON.parse(e.data);
   printMessage(message.time,message.writer,message.value);
 };

ws.onclose=function(e){
   changeUserStatus("offline");
   console.log("connection closed");
};

function searchUser(){
	var searchString=document.getElementById("search").value;
    fetch(url+'/users.json').then(res=>res.json())
  	.then(function(users){
  		var isFind=false;
	  	for (user in users){
		  	if (user==searchString){
		  		isFind=true;
		  		userSearch=document.createElement("div");
		  		userSearch.classList.add("userSearch");
		  		userSearch.id=user;
		  		userSearch.innerHTML='<span class="badge badge-success">'+user+'</span> ';
		  		divSearch.appendChild(userSearch);
		  		userSearch.addEventListener("click",function(event){
		  			currentUserName=event.target.id.toString();
		  			userHistory.innerHTML="";
		  			divSearch.removeChild(userSearch);
		  			downloadHistory(currentUserName)});
		  		break;
		  	}
	 	}; 
	 	if (isFind==false){
	 		userSearch=document.createElement("div");
		  	userSearch.classList.add("userSearch");	
		  	userSearch.innerHTML='<span class="badge badge-success">there is no such user</span> ';
		  	divSearch.appendChild(userSearch);
		  	userSearch.addEventListener("click",function(event){
		  			divSearch.removeChild(userSearch);
		  	});
	 	};
  	})


};

function longPollingToDb() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState != 4) return;
    if (this.status == 200) {
      if (this.responseText) {
      	users=JSON.parse(this.responseText);
      	userList.innerHTML="";
      	for (user in users){
		  	var userDiv=document.createElement("div");
		  	userDiv.classList.add("userDiv","bg-primary");
		  	userDiv.innerHTML='<span class="badge badge-pill badge-success">'+user;
		  	userDiv.id=user;
		  	usersList.appendChild(userDiv);
	 	}; 
    };
    longPollingToDb();
  }
};
  xhr.open("GET", url+'/users.json'+order, true);
  xhr.send();
};

longPollingToDb();

function getCommandInterface(){	
	var commandForm=document.forms.commandForm;
	var commandValue=commandForm.elements.command.value;
	if (commandValue=="getInfo"){
		label1.innerHTML="ipinfo";
		label2.innerHTML="ip-api";
		label3.innerHTML="geoip";
		//param1.addEventListener("click",conf);


	};
	if (commandValue=="command2"){

	};
};

function runCommand(command,params){
	printCommand(command,params);
};

function printCommand(command,params){
	var newDiv=document.createElement("div");
	newDiv.innerHTML='<span class="badge badge-warning">'+command+'</span><span class="badge badge-success">'
		+params[0]+' '
		+params[1]+' '
		+params[2]+' '
		+'</span>';
	commandLog.appendChild(newDiv);
};

function configureCommand(){
	var commandValue=commandForm.elements.command.value;
	var params=[];
	if (param1.checked){params.push(label1.innerHTML)};
	if (param2.checked){params.push(label2.innerHTML)};
	if (param3.checked){params.push(label3.innerHTML)};
	runCommand(commandValue,params);
};
