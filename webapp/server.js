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
    _:          _,
    // C:  Constants
});

// Initialise routes and pass the 'app' to add requests
// routes(app);

app.get("/", function ( req, res ) {

  var rrule = new RRule();

  res.render("list", {

    rrule: rrule
  });
});

// Start the server
app.listen( 3000, function () {

    console.log("Server: Server started, bitches!");
});
