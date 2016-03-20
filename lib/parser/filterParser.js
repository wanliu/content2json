var parse = require('./filter').parse;


function parseFilter(filter, options) {
  if (typeof options === 'undefined') { options = {}; }
  
  return function(row) {
    var data = row['data'] || {}
    options['content'] = data;   
    
    return parse(filter, options);
  }
}

module.exports = {
  parser: parseFilter
}
