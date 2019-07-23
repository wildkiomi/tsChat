var chatWidget;
var newMessage;
var messageStorage = [];
var minChat;
var maxChat;
var messageBox;
var submit;
var print;
var loginForm;
var text;
var initObj={};
var user={};

ws = new WebSocket("ws://localhost:8080");
  console.log("connect");
  ws.onopen=function(e){console.log("connected to server")};

var addMessageToDb;
var url='https://wildkiomichat.firebaseio.com';
var database = new Firebase(url);


function ChatWidget({chatTitle,botName,chatUrl,cssName,position,
  requests,allowMinimize,allowDrag,
  requireName,showDateTime}) {

  this.chatTitle=chatTitle||"Chat";
  this.botName=botName||"Bot";
  this.chatUrl=chatUrl||"https://wildkiomichat.firebaseio.com";
  this.cssName=cssName||"primary";
  this.position=position||"right";
  this.requests=requests||"fetch";
  this.allowMinimize=allowMinimize||false;
  this.allowDrag=allowDrag||false;
  this.requireName=requireName||false;
  this.showDateTime=showDateTime||false;

  initObj=this;

  initializeChat();
  addCss();
  returnToPreviousState();
  //initializeWs();
  
};

function initializeChat(chatTitle,botName){
  chatWidget = document.createElement("div");
  chatWidget.classList.add("chatWidget","card");
  chatWidget.innerHTML =
    '<div id="headChat" class="chatHeader"><span id="titleOfChat" class="text-white">'+initObj.chatTitle+'</span></div>' +
    '<button id="minChat" class="turnButton btn btn-sm" value="_" type="submit"/></button>' +
    '<div id="maxChat" class="chatContent">' +
    '<div id="print" class="printedMessages"></div>' +
    '<input id="messageBox" class="messageInput input-group-sm" type="text"/>' +
    '<button id="submitButton" type="button" class="submitButton btn btn-sm">Submit</button></div>';
  document.body.appendChild(chatWidget);

  minChat = document.getElementById("minChat");
  maxChat = document.getElementById("maxChat");
  messageBox = document.getElementById("messageBox");
  submit = document.getElementById("submitButton");
  print = document.getElementById("print");

  if (initObj.allowMinimize) minChat.addEventListener("click", turnChat);

  /*if (initObj.requests=="fetch") 
    addMessageToDb=function(time,writer,value,toWho){
      addToDBviaFetch(time,writer,value,toWho);
    }
  else 
    addMessageToDb=function(time,writer,value,toWho){
      addToDBviaXhr(time,writer,value,toWho);
    };*/

  if (initObj.allowDrag) dragChat();

  if (initObj.requireName) {
   createAuthMessage();
  }
  else{
    user=new User("anon");
    submit.addEventListener("click",sendMessage);
  };

  switch(initObj.cssName){
    case "danger":
      chatWidget.classList.add("bg-danger");
      submit.classList.add("btn-danger");
      minChat.classList.add("btn-danger");
      break;
    case "primary":
      chatWidget.classList.add("badge-primary");
      submit.classList.add("btn-primary");
      minChat.classList.add("btn-primary");
      break;
    case "success":
      chatWidget.classList.add("badge-success");
      submit.classList.add("btn-success");
      minChat.classList.add("btn-success");
      break;
    case "warning":
      chatWidget.classList.add("badge-warning");
      submit.classList.add("btn-warning");
      minChat.classList.add("btn-warning");
      break;
  };

};
  

function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
};


function dragChat(){
  text = document.getElementById("titleOfChat");

  text.onmousedown = function(e) {
  var coords = getCoords(text);
  var shiftX = e.pageX - coords.left;
  var shiftY = e.pageY - coords.top;

  document.body.appendChild(chatWidget);
  moveAt(e);

  chatWidget.style.zIndex = 1000;

  function moveAt(e) {
    chatWidget.style.left = e.pageX - shiftX + "px";
    chatWidget.style.top = e.pageY - shiftY + "px";
  };

  document.onmousemove = function(e) {
    moveAt(e);
  };

  text.onmouseup = function() {
    document.onmousemove = null;
    text.onmouseup = null;
  };
};

chatWidget.ondragstart = function() {
  return false;
};

};

function addCss() {
  var style = document.createElement("link");
  style.rel= 'stylesheet';
  style.href = 'css/chatStyle.css'; 
  style.type = 'text/css';
  document.head.appendChild(style);
};

function returnToPreviousState() {
  maxChat.hidden = !!localStorage.getItem("hiddenChat");
  chatWidget.style.height = localStorage.getItem("chatHeight");

  var historyMessage = JSON.parse(sessionStorage.getItem("historyMessage"));
  if (sessionStorage.historyMessage != null) {
    for (var i = 0; i < historyMessage.length; i++) {
      var message = document.createElement("div");
      if (historyMessage[i].writer == "user")
        message.className = "messageFromUser";
      else message.className = "messageFromBot";
      message.innerHTML = historyMessage[i].text;
      print.appendChild(message);
    };
  };
};


function turnChat() {
  if (maxChat.hidden) {
    maxChat.hidden = "";
    chatWidget.style.height = "350px";
    localStorage.setItem("hiddenChat", "");
    localStorage.setItem("chatHeight", "350px");
  } else {
    maxChat.hidden = true;
    chatWidget.style.height = "30px";
    localStorage.setItem("hiddenChat", "true");
    localStorage.setItem("chatHeight", "30px");
  };
};

function sendMessage() {
  newMessage = messageBox.value;
  messageBox.value="";
  var time=getRealTime();
  if(ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(
      {"time":time,
      "writer":user.name,
      "value":newMessage,
      "toWho":"operator"}))};
  printMessage(time,user.name,newMessage);
  addMessageToHistory(time,user.name,newMessage,"operator");
};

function printMessage(time,writer,value){
  var message = document.createElement("div");
  message.classList.add("messageFromUser","badge-primary","badge","text-wrap");
  if (initObj.showDateTime)
    message.innerHTML ='<span class="badge badge-warning">'+time+'</span> <span class="badge badge-success">'+writer+'</span> '+value;
  else
    message.innerHTML ='<span class="badge badge-success">'+writer+'</span> '+value;
  print.appendChild(message);
};


ws.onmessage = function(e){
   var message = JSON.parse(e.data);
   console.log("we got it");
   addMessageToHistory(message.time,message.writer,message.value,message.toWho);
   printMessage(message.time,message.writer,message.value);
 };

ws.onclose=function(e){
   changeUserStatus("offline");
   console.log("connection closed");
};

function addMessageToHistory(time,writer,value,toWho) {
  if (sessionStorage.getItem("historyMessage") != null) {
    messageStorage = JSON.parse(sessionStorage.getItem("historyMessage"));
  };
    messageStorage.push({time:time,writer:writer,value:value});
    sessionStorage.setItem("historyMessage", JSON.stringify(messageStorage));
  if (initObj.requests=="xhr"){ addToDBviaXhr(time,writer,value,toWho);}
  else {addToDBviaFetch(time,writer,value,toWho);};
};


function getRealTime() {
  var date = new Date();
  return date.getHours() + ":" + date.getMinutes();
};


function createAuthMessage(){
  var textDiv=document.createElement("div");
  textDiv.id="textDiv";
  textDiv.classList.add("alert", "alert-danger");
  textDiv.role="alert";
  textDiv.innerHTML="<p>Please, enter your name to connect to operator</p>"
  print.appendChild(textDiv);
  var name=submit.addEventListener("click",getName);
};

function getName(){
  var name=messageBox.value;
  messageBox.value="";
  user=new User(name);
  var time=getRealTime();
  print.removeChild(textDiv);
  ws.send(JSON.stringify({
    "time":time,
    "writer": user.name,
    "value":"new user",
    "toWho":"operator"
    }));
  addToDBviaFetch(time,user.name,"new user","operator");
  changeUserStatus("online");
  submit.removeEventListener("click",getName);
  submit.addEventListener("click",sendMessage);
};

function User(name){
  this.name=name;
};

function addToDBviaXhr(time,writer,value,toWho){
  var xhr=new XMLHttpRequest();
  xhr.open('POST', url+'/users/'+user.name+'/history.json', false);
  xhr.send(JSON.stringify({time,writer,value,toWho}));
  if (xhr.status != 200) 
    console.log( xhr.status + ': ' + xhr.statusText ); 
};

function addToDBviaFetch(time,writer,value,toWho){
  fetch(url+'/users/'+user.name+'/history.json', {
    method: 'post',
    body:JSON.stringify({time,writer,value,toWho})
}).then(res=>res.json())
  .then(res => console.log(res));
};

function changeUserStatus(value){
  var xhr=new XMLHttpRequest();
  xhr.open('POST', url+'/users/'+user.name+'/status.json', false);
  xhr.send(JSON.stringify({"status":value}));
  if (xhr.status != 200) 
    console.log( xhr.status + ': ' + xhr.statusText ); 
};



