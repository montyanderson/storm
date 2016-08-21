const Hogan = require("hogan.js");

module.exports = class View {
	constructor(template, init, locals) {
		this.template = Hogan.compile(template);
		this.init = init || function() {};
		this.locals = locals || {};
	}


	render(locals) {
		this.init(this.template.render(Object.assign({}, this.locals, locals)));
	}
}
