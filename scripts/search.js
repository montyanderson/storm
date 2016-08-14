const Hogan = require("hogan.js");
const View = require("./view.js");
const sources = require("./sources.js");

const search = module.exports = new View(`
	{{#artists}}
        <div class="card small" data-id="{{id}}" data-type="{{{type}}}" data-name="{{name}}">
            <div class="card-image red {{#color}}{{name}}{{/color}}">
                <img src="{{image}}">
                <span class="card-title">{{name}}</span>
          </div>
                <div class="card-content">
					{{{description}}}
              </div>
          </div>
	{{/artists}}
`, (view) => {
	$(".search-results").html(view);

	$(".search-results .card").click(function() {
		const card = $(this);

		sources.locals.sources = sources.locals.sources || [];

		console.log(card.data());

		const id = card.attr("data-id");
		const type = card.attr("data-type");

		if(sources.locals.sources.filter(a => a.id == id).length == 0) {
			sources.locals.sources.push({
				id, type
			});
		}

		sources.render();
	});
});

search.locals.color = require("./color.js");
