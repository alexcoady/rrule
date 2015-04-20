
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

// Initialise routes and pass the "app" to add requests
// routes(app);

app.get("/", function ( req, res ) {

  var rrule = new RRule({
    freq: RRule.MONTHLY,
    dtstart: new Date( 2014, RRule.NOV, 8 ),
    interval: 1,
    // until: new Date( 2016, RRule.FEB, 2 ),
    count: 12,
    // bysetpos: [ 1, 2, 3, 4, 5, -1 ],
    // byweekday: [ RRule.MO, RRule.TU, RRule.TH ],
    bymonthday: [ 29 ],
  });

  res.render("list", {
    rrule: rrule
  });
});

// Start the server
app.listen( 3000, function () {

    console.log("Server: Server started, bitches!");
});
