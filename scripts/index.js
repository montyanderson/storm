const View = require("./view.js");
const search = require("./search.js");
const sources = require("./sources.js");

$("#search").keyup(() => {
	$.ajax({
		url: "/search",
		data: {q: $("#search").val()},
		success: (res) => {
			search.render({artists: JSON.parse(res)});
		}
	});
});
