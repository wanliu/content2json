var parse = require('./logical').parse;
require('../misc');

function parseColumns(colArgv, options) {
  var all = false;
  var args =  colArgv.split(',');
  var columns = [];
  
  if (typeof options === 'undefined') { options = {}; }
  
  for (var i = 0; i < args.length; i++) {
    var col = args[i];
    var _ref = col.split('->'), exp = _ref[0], target = _ref[1];

    if (exp.trim() != '*') {
      if (!target) {
        throw new Error('target cant empty'); 
      }
      columns.push({
        column: exp.trim(),
        target: target.trim()
      });
    } else {
      all = true;
      columns.unshift({
        column: '*'
      });
    }
  }
  
  return function(row) {
    var data = row['data'] || {}
    options['content'] = data;
    var newData = all ? data : {};   
    
    for (var j = 0; j < columns.length; j ++) {
      var exp = columns[j];

      if (exp.column === '*') { continue ; /* ignore */ }
      
      if (exp.target.trim() === '!') { // delete
        delete newData[exp.column]; 
        // parse(filter, options);
      } else {
        newData[exp.target] = parse(exp.column, options);
      }
    }
    
    row['data'] = newData;
    return row;
  }
}

module.exports = {
  parser: parseColumns
};
