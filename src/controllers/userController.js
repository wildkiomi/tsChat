exports.deleteUser = function (request, response){
    response.send("Delete user");
};
exports.changeUser = function (request, response){
    response.send("Change user");
};
exports.getUsers = function(request, response){
    response.render("users.hbs",{
    	title:"Users",
    	linkToCss:""
    });
};