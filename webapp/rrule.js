var _ = require("underscore");
var Weekday = require("./weekday");
var IteratorYearly = require("./iterator-yearly");
var IteratorMonthly = require("./iterator-monthly");
var IteratorWeekly = require("./iterator-weekly");
var IteratorDaily = require("./iterator-daily");

function RRule ( options ) {

  var options = options || {};

  if ( options.until && options.count ) {
    throw new Error("until and count properties cannot both be set");
  }

  if ( options.count && options.count <= 0 ) {
    throw new Error("count must be a positive integer (not including 0)");
  }

  // Force single values into an array for these properties
  if ( options.bysetpos ) options.bysetpos = [].concat( options.bysetpos );
  if ( options.bymonthday ) options.bymonthday = [].concat( options.bymonthday );
  if ( options.byweekday ) options.byweekday = [].concat( options.byweekday );
  if ( options.byyearday ) options.byyearday = [].concat( options.byyearday );

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


RRule.OPTION_NAMES = [
  "freq",
  "dtstart",
  "interval",
  "wkst",
  "count",
  "until",
  "bysetpos",
  "bymonthday",
  "byweekday",
  "byyearday"
];


RRule.DEFAULT_OPTIONS = {

  freq: undefined,
  dtstart: undefined,
  interval: 1,
  wkst: RRule.MO,
  count: undefined,
  until: undefined,
  bysetpos: [],
  bymonthday: [],
  byweekday: [],
  byyearday: []
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
  loopKill: 500,
  sort: false,
  iterator: function ( date, i ) {
    return i < 1000;
  },
  predicate: function ( date, i ) {
    return true;
  }
};


/**
 *
 *  @param {Object} options
 *  @return {Object} options
 */
RRule.prototype.addFactory = function ( options, dates ) {

  var rrule = this;

  var predicate = options.predicate;
  var iterator = options.iterator;

  var maxDate = options.maxDate;
  var minDate = options.minDate;

  options.add = function ( date ) {

    // Break if enough dates have been added
    if ( dates.length >= rrule.count ) return false;

    // Break if out of date bounds
    if ( minDate && date.isBefore(minDate) ) return true;
    if ( maxDate && date.isAfter(maxDate) ) return false;

    // Test against iterator and predicate
    if ( !iterator( date, dates.length ) ) return false;
    if ( predicate( date, dates.length ) ) return dates.push( new Date(date.getTime()) );

    return true;
  };

  return options;
};


/**
 *
 *  @param {Object} options
 *  @return {Object} options
 */
RRule.prototype.calcMinDate = function ( options ) {

  if ( options.after ) {

    options.minDate = new Date(Date.compare(options.after, this.dtstart) === -1 ? this.dtstart : options.after );

  } else {

    options.minDate = this.dtstart;
  }

  return options;
};


/**
 *
 *  @param {Object} options
 *  @return {Object} options
 */
RRule.prototype.calcMaxDate = function ( options ) {

  if ( options.before && this.until ) {

    options.maxDate = new Date(Date.compare(options.before, this.until) === -1 ? options.before : this.until);

  } else if ( options.before ) {

    options.maxDate = new Date( options.before );

  } else if ( this.until ) {

    options.maxDate = new Date(  this.until );
  }

  return options;
};


/**
 *
 *  @param {Object} options
 *  @return {[Date]} Array of recurring dates
 */
RRule.prototype.calcStartDate = function ( options ) {

  if ( !options.after ) {
    options.after = new Date( this.dtstart.getTime() );
  }

  return options;
}


/**
 *
 *  @param {Object} options
 *  @return {Object} options
 */
RRule.prototype.list = function ( options ) {

  var options = _.extend( RRule.DEFAULT_LIST_OPTIONS, options );
  var pointer;
  var dates = [];
  var count = -1;

  this.calcMinDate( options );
  this.calcMaxDate( options );
  this.calcStartDate( options );
  this.addFactory( options, dates );

  pointer = new Date( options.after );

  // MASTER LOOP
  masterloop: while ( count++ < options.loopKill ) {

    // YEARLY LOOP
    if ( this.freq === RRule.YEARLY ) {

      if ( !IteratorYearly.list(this, options, new Date(pointer)) ) break masterloop;
    }

    // MONTHLY LOOP
    else if ( this.freq === RRule.MONTHLY ) {

      if ( !IteratorMonthly.list(this, options, new Date(pointer)) ) break masterloop;
    }

    // WEEKLY LOOP
    else if ( this.freq === RRule.WEEKLY ) {

      if ( !IteratorWeekly.list(this, options, new Date(pointer)) ) break masterloop;
    }

    // DAILY LOOP
    else if ( this.freq === RRule.DAILY ) {

      if ( !IteratorDaily.list(this, options, new Date(pointer)) ) break masterloop;
    }

    // Update iterator
    if ( this.freq === RRule.YEARLY ) {
      pointer.setFullYear( pointer.getFullYear() + this.interval );
    } else if ( this.freq === RRule.MONTHLY ) {
      pointer.setMonth( pointer.getMonth() + this.interval );
    } else if ( this.freq === RRule.WEEKLY ) {
      pointer.setDate( pointer.getDate() + ( this.interval * 7 ) );
    } else if ( this.freq === RRule.DAILY ) {
      pointer.setDate( pointer.getDate() + this.interval );
    }
  }

  console.log("Looped %s times; generated %s dates", count, dates.length);

  if ( !options.sort ) return dates;

  return dates.sort(function (a, b) {
    return a.getTime() - b.getTime();
  });
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

  if ( this.byyearday.length ) {
    rules.push( "BYYEARDAY=" + this.byyearday.join(",") );
  }

  return "RRULE:" + rules.join(";");
};


module.exports = RRule;
