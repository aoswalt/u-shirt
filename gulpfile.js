"use strict";

const gulp = require("gulp");
const connect = require("gulp-connect");
const del = require("del");
const runSequence = require("run-sequence");
const sass = require("gulp-sass");

const sourcePath = "./src";
const publicPath = "./public";
const sassRelativePath = "/styles";

const allSourcePath = `${sourcePath}/**/*`;
const allPublicPath = `${publicPath}/**/*`;
const allSassPath = `${sourcePath}${sassRelativePath}/**/*.scss`;
const sassEntryPath = `${sourcePath}${sassRelativePath}/main.scss`;
const staticPath = [allSourcePath, `!${allSassPath}`];


gulp.task("clean:all", () => del(allPublicPath));


gulp.task("static:copy", () =>
  gulp.src(staticPath)
    .pipe(gulp.dest(publicPath)));


gulp.task("sass:compile", () => (
  gulp.src(sassEntryPath)
    .pipe(sass())
      .on("error", sass.logError)
    .pipe(gulp.dest(`${publicPath}/styles`))
));


gulp.task("connect", () =>
  connect.server({
    root: publicPath,
    livereload: true
  }));

gulp.task("livereload", () =>
  gulp.src(allPublicPath)
    .pipe(connect.reload()));


gulp.task("watch", () =>
  runSequence(
    "clean:all",
    "build",
    [
      "static:watch",
      "sass:watch",
      "livereload:watch",
      "connect"
    ]
  ));

gulp.task("static:watch", () =>
  gulp.watch(staticPath, ["static:copy"]));

gulp.task("sass:watch", () =>
  gulp.watch(allSassPath, ["sass:compile"]));

gulp.task("livereload:watch", () =>
  gulp.watch(allPublicPath, ["livereload"]));


gulp.task("build", ["sass:compile", "static:copy"]);
