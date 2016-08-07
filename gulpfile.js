const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");

gulp.task("scripts", () => {
	browserify("./scripts/index.js")
		.transform("babelify", {presets: ["es2015"]})
		.bundle()
		.pipe(source("index.js"))
		.pipe(gulp.dest("./static/"));
});

gulp.task("watch", () => {
	gulp.watch("./scripts/*", ["scripts"]);
});

gulp.task("default", ["scripts"]);
gulp.task("dev", ["default", "watch"]);
