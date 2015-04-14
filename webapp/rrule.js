var _ = require("underscore");

function RRule ( options ) {

  // Required
  this.freq = undefined;

  // 0 or 1 of these
  this.until = undefined;
  this.count = undefined;

  this.dtstart = undefined;
  this.wkst = RRule.MO;

  this.interval = 1;
  this.byday = [];
  this.bysetpos = [];
  this.bymonthday = [];
  this.byweekday = [];
}

// CONSTANTS
RRule.DAILY = 1;
RRule.WEEKLY = 2;
RRule.MONTHLY = 3;
RRule.YEARLY = 4;

RRule.MO = 1;
RRule.TU = 2;
RRule.WE = 3;
RRule.TH = 4;
RRule.FR = 5;
RRule.SA = 6;
RRule.SU = 7;


RRule.prototype.toString = function () {

  var string = "RRULE:";

  return string;
};


module.exports = RRule;
