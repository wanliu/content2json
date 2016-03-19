#!/usr/bin/env node

var parseArgs = require('minimist')

var Parser = require('../lib/parser');


function usage() {
  
  output = "Usage: content2json [options]\n\n" +
           "Options:\n" +
           "   -h, --help               Help this tools\n" +
           "   -m, --markdown=filename  Input to convert json Markdown files\n" +
           "   -r, --sort='fields,...'  Sort the per content\'s front-matter expression\n\n" + 
           "                              Example:\n" +
           "                                --sort='price desc#number, date'\n\n" +
           "                              # => sort price as number with order desc and\n" +
           "                              second order with date order by default asc\n\n" +
           "   -f, --filter             Filter every search select valid row with contents\n" +
           "   -s, --schema             Output format, contains: 'array, full, file'\n";
           "   -e, --execute            Execute a shell script, or program with every json\n";

  console.log(output);
}


/**
 * sort 
 * 
 * Example:
 *   --sort='date,desc'
 *   --sort='date desc, name'
 *  
 */


// if (argv.sort) {
//   var sorter = parseSort(argv.sort);
// }

/**
 * filter
 * 
 * Example:
 *    --filter='price > 188'
 */
// if (argv.filter) {
//   var filter = parseFilter(argv.filter);  
// }

/**
 * columns
 * 
 * Example:
 *    --column=cover_url=>coverUrl  
 */

// if (argv.columns) {
//   var columner = parseColumn(argv.columns);
// }

/**
 * schema
 * 
 * Exmaple:
 * 
 *    --schema={$fullPathname: $data} // default
 *    or 
 *    --schema=[$data.Values...]
 */

// if (argv.schema) {
//   var schemer = parseSchema(argv.schema);
// }


function main() {
  try {
    var argv = parseArgs(process.argv);
    
    if (argv.h || argv.help) return usage();
    
    var results = Parser.parse(argv);
    console.log(results);    
  } catch(e) {
    console.error(e.stack);
    usage();
  }
}

main();
