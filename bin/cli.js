#!/usr/bin/env node

var parseArgs = require('minimist')

var Parser = require('../lib/parser');

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
  var argv = parseArgs(process.argv);
  var results = Parser.parse(argv);
  console.log(results);
}

main();
