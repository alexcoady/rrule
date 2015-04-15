var _ = require("underscore");
var Weekday = require("./weekday");

function RRule ( options ) {

  var options = options || {};

  if ( options.until && options.count ) {
    throw new Error("until and count properties cannot both be set");
  }

  if ( options.count && options.count <= 0 ) {
    throw new Error("count must be a positive integer (not including 0)");
  }

  if ( options.bysetpos ) options.bysetpos = [].concat( options.bysetpos );
  if ( options.bymonthday ) options.bymonthday = [].concat( options.bymonthday );
  if ( options.byweekday ) options.byweekday = [].concat( options.byweekday );

  _.extend( this, RRule.DEFAULT_OPTIONS, options );
}


RRule.YEARLY = 0;
RRule.MONTHLY = 1;
RRule.WEEKLY = 2;
RRule.DAILY = 3;


RRule.MO = new Weekday(0);
RRule.TU = new Weekday(1);
RRule.WE = new Weekday(2);
RRule.TH = new Weekday(3);
RRule.FR = new Weekday(4);
RRule.SA = new Weekday(5);
RRule.SU = new Weekday(6);


RRule.JAN = 0;
RRule.FEB = 1;
RRule.MAR = 2;
RRule.APR = 3;
RRule.MAY = 4;
RRule.JUN = 5;
RRule.JUL = 6;
RRule.AUG = 7;
RRule.SEP = 8;
RRule.OCT = 9;
RRule.NOV = 10;
RRule.DEC = 11;


RRule.DEFAULT_OPTIONS = {

  freq: undefined,
  dtstart: undefined,
  interval: 1,
  wkst: RRule.MO,
  count: undefined,
  until: undefined,
  bysetpos: [],
  bymonthday: [],
  byweekday: []
};


RRule.FREQUENCIES = [
  "YEARLY",
  "MONTHLY",
  "WEEKLY",
  "DAILY"
];


RRule.DEFAULT_LIST_OPTIONS = {
  after: undefined,
  before: undefined,
  include: true,
  iterator: function ( date, i ) {
    // console.log("Iterator at %s: %s", i, date);
    return i < 100;
  },
  predicate: function ( date, i ) {
    // console.log("Predicate at %s: %s", i, date);
    return true;
  }
};





RRule.prototype.add = function ( options ) {

  var predicate = options.predicate;
  var iterator = options.iterator;

  return function ( date, dates ) {

    if ( !iterator( date, dates.length ) ) return false;
    if ( predicate( date, dates.length ) ) return dates.push( new Date(date.getTime()) );
  };
};



RRule.prototype.list = function ( options ) {

  var options = options || {};

  _.extend( options, RRule.DEFAULT_LIST_OPTIONS, options );

  // console.log("list", options);

  var after = options.after;
  var before = options.before;
  var include = options.include;

  var dates = [];
  var kill = 200;

  var dtstart = new Date( this.dtstart.getTime() );

  var maxDate = options.before ? new Date( options.before.getTime() ) : undefined;
  var minDate = options.after ? new Date( options.after.getTime() ) : undefined;

  if ( this.until ) {

    maxDate = !maxDate || ( maxDate.getTime() > this.until.getTime() ) ? this.until : undefined;
  }

  var iter = new Date( dtstart.getTime() );
  var pointer = undefined;

  var add = this.add( options );


  masterloop: while ( true && 0 < kill-- ) {

    // Reset internal pointer
    pointer = new Date( iter );

    // BREAKS
    if ( maxDate && maxDate.getTime() < iter.getTime() ) break;
    if ( dates.length >= this.count ) break;


    // YEARLY LOOP
    if ( this.freq === RRule.YEARLY ) {


    }

    // WEEKLY LOOP
    else if ( this.freq === RRule.MONTHLY ) {


    }

    // WEEKLY LOOP
    else if ( this.freq === RRule.WEEKLY ) {

      // Breaks
      if ( !this.byweekday.length ) break masterloop;

      // Loop through days of week and see if appropriate
      weekloop: for ( var i = 0; i < this.byweekday.length; i += 1 ) {

        var difference = this.byweekday[i].toJSDateDay() - iter.getDay();
        difference = difference < 0 ? difference + 7 : difference;
        pointer.setDate( iter.getDate() + difference );

        if ( !add( pointer, dates ) ) break masterloop;
      }
    }

    // DAILY LOOP
    else if ( this.freq === RRule.DAILY ) {

      if ( !add( pointer, dates ) ) break masterloop;
    }

    // Update iterator
    if ( this.freq === RRule.YEARLY ) {
      iter.setYear( iter.getYear() + this.interval );
    } else if ( this.freq === RRule.MONTHLY ) {
      iter.setMonth( iter.getMonth() + this.interval );
    } else if ( this.freq === RRule.WEEKLY ) {
      iter.setDate( iter.getDate() + ( this.interval * 7 ) );
    } else if ( this.freq === RRule.DAILY ) {
      iter.setDate( iter.getDate() + this.interval );
    }
  }

  console.log("Loop iterated %s time(s)", 200 - kill);

  return dates;
}


RRule.prototype.toString = function () {

  var rules = [];

  if ( this.freq )
    rules.push( "FREQ=" + RRule.FREQUENCIES[this.freq] );

  if ( this.dtstart )
    rules.push( "DTSTART=" + this.dtstart.toISOString() );

  if ( this.interval )
    rules.push( "INTERVAL=" + this.interval );

  if ( this.interval !== undefined )
    rules.push( "WKST=" + this.wkst.toString() );

  if ( this.count !== undefined )
    rules.push( "COUNT=" + this.count );

  if ( this.until )
    rules.push( "UNTIL=" + this.until.toISOString() );

  if ( this.bysetpos.length ) {
    rules.push( "BYSETPOS=" + this.bysetpos.join(",") );
  }

  if ( this.bymonthday.length ) {
    rules.push( "BYMONTHDAY=" + this.bymonthday.join(",") );
  }

  if ( this.byweekday.length ) {
    rules.push( "BYWEEKDAY=" + _.map( this.byweekday, function ( weekday ) {
      return weekday.toString();
    }).join(",") );
  }

  return "RRULE:" + rules.join(";");
};


module.exports = RRule;
