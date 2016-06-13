"use strict";

const gulp = require("gulp");
const connect = require("gulp-connect");
const del = require("del");
const runSequence = require("run-sequence");

const sourcePath = "./src";
const publicPath = "./public";

const allSourcePath = `${sourcePath}/**/*`;
const allPublicPath = `${publicPath}/**/*`;


gulp.task("clean:all", () => del(allPublicPath));

gulp.task("static:copy", () =>
  gulp.src(allSourcePath)
    .pipe(gulp.dest(publicPath)));

gulp.task("static:watch", () =>
  gulp.watch(allSourcePath, ["static:copy"]));


gulp.task("connect", () =>
  connect.server({
    root: publicPath,
    livereload: true
  }));

gulp.task("livereload", () =>
  gulp.src(allPublicPath)
    .pipe(connect.reload()));

gulp.task("livereload:watch", () =>
  gulp.watch(allPublicPath, ["livereload"]));


gulp.task("build", ["static:copy"]);

gulp.task("watch", () =>
  runSequence(
    "clean:all",
    "build",
    [
      "static:watch",
      "livereload:watch",
      "connect"
    ]
));
