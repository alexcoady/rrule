// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var DateUtils = require("date-utils");
var DateFormat = require("dateformat");
var RRule = require("./rrule");
var app = express();


// App settings
app.set( "view engine", "jade" );
app.set( "views", "webapp/views/" );
app.use( bodyParser() );


// This should always be the last middleware function (handles all errors)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, "Something broke (check terminal)");
});

/* MIDDLEWARE STOPS HERE */
app.use("/public", express.static(__dirname + "/../public/"));

_.extend( app.locals, {
    _: _,
    RRule: RRule,
    DateUtils: DateUtils,
    DateFormat: DateFormat
});


app.get("/", function ( req, res ) {

  var rrule = new RRule({
    freq: RRule.MONTHLY,
    dtstart: new Date( 2015, RRule.MAY, 1 ),
    interval: 1,
    // until: new Date( 2015, RRule.AUG, 8 ),
    count: 100,
    bysetpos: [ -1 ],
    byweekday: [
      // RRule.FR.nth(1),
      RRule.MO,
      RRule.TU,
      RRule.WE,
      RRule.TH,
      RRule.FR
    ]
    // bymonthday: [ 8, 10 ],
    // byyearday: [1,100,200,300]
  });

  res.render("list", {
    rrule: rrule
  });
});

// Start the server
app.listen( 3000, function () {

    console.log("Server: Server started, bitches!");
});
