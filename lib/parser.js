var parseSorter = require('./parser/sortedParser').parser;
var defaultSort = require('./parser/sortedParser').default;
var parseFiles = require('./parser/filesParser').parser;
var parseFilter = require('./parser/filterParser').parser;
var parseColumns = require('./parser/columnsParser').parser;
var ArrayPiper = require('./arrayPiper');

function nochange(array) {
  return array; 
}

var noFilter, allColumns, fullSchema;

noFilter = allColumns = fullSchema = nochange;

function parseSchema(schemaArg) {
  
  switch(schemaArg) {
    case 'data':
      schemer = rowMaker(function(row) {
        return row['data'];
      });
      break;
    case 'full':
      schemer = fullSchema;
      break;
    default: 
      throw new Error("Invalid schema format, must be ['data', 'full']"); 
  }
    
  return schemer;
}

function parseAll(argv) {
  var jsons = [];
   
  if (argv.m || argv.markdown) {
    jsons = parseFiles(argv.m || argv.markdown);
    } else {
    throw new Error('Need `-m, --markdown` arguments...');
  }
  
  var sortArg = argv.r || argv.sort;
  var filterArg = argv.f || argv.filter;
  var columnArg = argv.c || argv.columns;
  var schemaArg = argv.s || argv.schema;
  
  var sorter = sortMaker( sortArg ? parseSorter(sortArg) : defaultSort );
  var optFilter = argv.ignore === 'null' ? { ignoreNull: true } : {}; 
  var filter = filterMaker( filterArg ? parseFilter(filterArg, optFilter) : noFilter );
  var columner = rowMaker(  columnArg ? parseColumns(columnArg, optFilter) : allColumns );
  var schemer = schemaArg ? parseSchema(schemaArg) : fullSchema;
  
  var runner = new ArrayPiper(jsons);
  
  return runner
    .pipe(columner)
    .pipe(filter)
    .pipe(sorter)
    .pipe(schemer)
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
  parseFilter: parseFilter,
  parseColumns: parseColumns,
  parse: parseAll
}
