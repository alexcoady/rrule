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

     // Reset to pointer
     monthPointer = new Date( pointer );

     // Set correct date
     monthPointer.setDate( rrule.bymonthday[i] );

     // Month may have jumped to next month
     // e.g. if date is 31 in a month with 28 days
     if ( monthPointer.getMonth() !== pointer.getMonth() ) continue;

     // Add
     if ( !options.add( monthPointer ) ) return false;
   }

  // Keep loop going
  return true;
};


module.exports = IteratorMonthly;
