"use strict";

// dependencies
var gulp        = require("gulp"),
    nodemon     = require("gulp-nodemon");


// paths
var paths = {};

paths.backEnd = {
  scriptSource:   "webapp/**/*.js",
  scriptMain:     "webapp/server.js"
};


/* NODE SERVER */
gulp.task("server", function () {

  nodemon({
    script: paths.backEnd.scriptMain,
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
