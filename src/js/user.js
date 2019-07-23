var mongoose=require("mongoose");
Schema=mongoose.Schema;
var History=require("./history");

var schema=new Schema({
	name: {
		type:String,
		unique: true,
		require: true
	}, 
	id: {
		type:String,
		unique: true,
		require: true
	}
});


module.exports=mongoose.model("User",schema);