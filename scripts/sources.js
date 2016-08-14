const View = require("./view.js");

const sources = module.exports = new View(`
	<ul class="collection">
		{{#sources}}
		<li class="collection-item">{{id}}</li>
		{{/sources}}
	</ul>
`, (view) => {
	$(".sources").html(view);
});
