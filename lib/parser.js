var parseSorter = require('./parser/sortedParser').parser;
var defaultSort = require('./parser/sortedParser').default;
var parseFiles = require('./parser/filesParser').parser;
var parseFilter = require('./parser/filterParser').parser;
var ArrayPiper = require('./arrayPiper');

function parseAll(argv) {
  var jsons = [];
   
  if (argv.md) {
    jsons = parseFiles(argv.md);
    } else {
    throw new Error('Need parse arguments...');
  }

  var sorter = sortMaker( argv.sort ? parseSorter(argv.sort) : defaultSort );
  
  var runner = new ArrayPiper(jsons);
  
  return runner
    .pipe(sorter)
    // .pipe(filtered)
    // .pipe(columner)
    // .pipe(schemer)
    .result();
}

function rowMaker(func) {
  return function row(array) {
    return array.map(function(item) {
      return func(item);
    });
  }  
}

function filterMaker(func) {
  return function row(array) {
    return array.filter(function(item) {
      return func(item);
    });
  }
}

function sortMaker(func) {
  return function sortable(array) {
   return array.sort(function(a, b) {
      return func(a, b);      
    });
  }  
}

module.exports = {
  parseSorter: parseSorter,
  parseFiles: parseFiles,
  parse: parseAll
}
