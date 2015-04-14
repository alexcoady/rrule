function Weekday ( weekday, n ) {

  if ( n === 0 ) {
    throw new Error("Cannot create weekday with n == 0");
  }

  if ( weekday > 6 ) {
    throw new Error("Weekday cannot be more than 6");
  }

  this.weekday = weekday;
  this.n = n;
}

Weekday.prototype.toString = function () {

  var string = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"][this.weekday];

  if ( this.n ) {

    string = ( this.n > 0 ? "+" : "" ) + String(this.n) + string;
  }

  return string;
};

Weekday.prototype.equals = function ( other ) {

  return this.n == other.n && this.weekday == other.weekday;
};

Weekday.prototype.nth = function ( n ) {

  return this.n == n ? this : new Weekday( this.weekday, n );
};

Weekday.prototype.toJSDateDay = function () {

  return this.weekday === 6 ? 0 : this.weekday + 1;
};

module.exports = Weekday;
