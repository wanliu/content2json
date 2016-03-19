var parseSorter = require('./parser/sortedParser').parser;
var defaultSort = require('./parser/sortedParser').default;
var parseFiles = require('./parser/filesParser').parser;
var parseFilter = require('./parser/filterParser').parser;
var ArrayPiper = require('./arrayPiper');

function parseAll(argv) {
  var jsons = [];
   
  if (argv.m || argv.markdown) {
    jsons = parseFiles(argv.m || argv.markdown);
    } else {
    throw new Error('Need `-m, --markdown` arguments...');
  }
  
  var sortArg = argv.r || argv.sort;

  var sorter = sortMaker( sortArg ? parseSorter(sortArg) : defaultSort );
  
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
