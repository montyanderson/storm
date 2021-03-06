const Hogan = require("hogan.js");
const View = require("../view.js");
const sources = require("./sources.js");
const color = require("../color.js");

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

		if(sources.locals.sources.filter(a => a.id == $(card).data("id")).length == 0) {
			sources.locals.sources.push(card.data());
		}

		sources.render();
	});
}, {color});
