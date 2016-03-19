var parse = require('./filter').parse;


function parseFilter(filter) {
  return function(row) {
    var data = row['data'] || {}
    return parse(filter, { content: data });
  }
}

module.exports = {
  parser: parseFilter
}
