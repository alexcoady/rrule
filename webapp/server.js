// Dependencies
var express         = require('express'),
    bodyParser      = require('body-parser'),
    _               = require('underscore'),
    RRule           = require('./rrule'),
    app             = express();


// App settings
app.set( 'view engine', 'jade' );
app.set( 'views', 'webapp/views/' );
app.use( bodyParser() );


// This should always be the last middleware function (handles all errors)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke (check terminal)');
});

/* MIDDLEWARE STOPS HERE */
app.use('/public', express.static(__dirname + '/../public/'));

_.extend( app.locals, {
    _: _
});

// Initialise routes and pass the 'app' to add requests
// routes(app);

app.get("/", function ( req, res ) {

  var rrule = new RRule({
    freq: RRule.DAILY,
    dtstart: new Date( 2015, RRule.FEB, 7 ),
    interval: 2,
    count: 10,
    bysetpos: [ 1, 2, 3, 4, 5, -1 ],
    byweekday: [ RRule.MO, RRule.TU ],
    bymonthday: [ 1, 2, 3 ],
  });

  res.render("list", {
    rrule: rrule
  });
});

// Start the server
app.listen( 3000, function () {

    console.log("Server: Server started, bitches!");
});
