const Hogan = require("hogan.js");

const View = module.exports = function(template, init) {
	this.template = Hogan.compile(template);
	this.init = init || function() {};
	this.locals = {};
}

View.prototype.render = function(locals) {
	this.init(this.template.render(Object.assign({}, this.locals, locals)));
}
