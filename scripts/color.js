const Hogan = require("hogan.js");

module.exports = () => {
	const colors = ["red", "blue", "orange lighten-2", "cyan"];

	return function(template) {
		const text = Hogan.compile(template).render(this);
		let sum = 0;

		text.split("").forEach(c => sum += c.charCodeAt());
		return colors[sum % colors.length];
	};
};
