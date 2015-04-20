"use strict";

// dependencies
var gulp = require("gulp");
var nodemon = require("gulp-nodemon");


gulp.task("server", function () {

  nodemon({
    script: "webapp/server.js",
    ext: "js",
    env: {
      "NODE_ENV": "development"
    }
  })
  .on("restart", function () {
    console.log("Nodemon: restarting");
  });

});

gulp.task("default", ["server"]);
