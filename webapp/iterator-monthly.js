function IteratorMonthly () {}


/**
 *
 *  @param {RRule} rrule The current recurrance rule
 *  @param {Object} options RRule loop options
 *  @param {Date} pointer The provided date to work from
 *  @return {Bool} true if master loop should continue
 */
 IteratorMonthly.loop = function ( rrule, options, pointer ) {

   var i = 0;
   var monthdaysCount = rrule.bymonthday.length;
   var monthPointer;

   // Go to last date of the previous month
   pointer.setDate( 0 );

   for ( i; i < monthdaysCount; i += 1 ) {

     monthPointer = new Date( pointer );
     monthPointer.setDate( rrule.bymonthday[i] );

     console.log( "Month pointer:", monthPointer );
     if ( !options.add( monthPointer ) ) return false;
   }

  // Keep loop going
  return true;
};


module.exports = IteratorMonthly;
