var express = require('express');
var app = express();
const expressHbs = require("express-handlebars");
var bodyParser = require('body-parser');
const hbs = require("hbs");
const mongoose = require("mongoose");
var expressWs = require('express-ws')(app);
var swaggerUi = require('swagger-ui-express'),
	swaggerDocument = require('../swagger.json');

app.engine("hbs", expressHbs(
    {
        layoutsDir: __dirname + "/views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))

app.use(express.static(__dirname + "/static"));

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

hbs.registerPartials(__dirname + "/views/partials");

const userRouter = require("./routes/userRouter.js");
const homeRouter = require("./routes/homeRouter.js");
const messageRouter = require("./routes/messageRouter.js");
const chatRouter=require("./routes/chatRouter.js");


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/chat",chatRouter); 
app.use("/users", userRouter);
app.use("/message", messageRouter);
app.use("/", homeRouter);

app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

mongoose.connect("mongodb://localhost:27017/usersdb", 
	{ useNewUrlParser: true }, 
	function(err) {
    	if (err) {
    		console.log(err)
    	};
    app.listen(process.env.PORT || 8080, function() {
    	 console.log("Server is ready");
    });
});
