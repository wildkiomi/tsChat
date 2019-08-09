exports.operator = function (request, response) {
    response.render("operator",{
    	title:"Operator",
    	linkToCss:"css/operatorStyle.css"
    });
};
exports.configurator = function (request, response) {
    response.render("configurator",{
    	title:"Configuration",
    	linkToCss: "css/configuration.css"
    });
};
exports.home = function (request, response) {
    response.render("home",{
    	title:"Home"
    });
};