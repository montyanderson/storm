const View = require("./view.js");

const sources = module.exports = new View(`
	{{#sources}}
		{{type}} {{id}}
	{{/sources}}
`, (view) => {
	$(".sources").html(view);
});
