var pairFind = require('./pairFind');

var HeaderTags = {
  '+++': 'toml',
  '---': 'yaml',
  '{': 'json'
};
  
var getHeader = function(rawStr, pos) {
  if (typeof pos === 'undefined' ) { pos = 0; }

  str = rawStr.slice(pos);
  try {
    for (var key in HeaderTags) {
      pos = pairFind(str, key);
      
      if (pos > 0) {
        var headerPos = str.indexOf(key);
        var body = str.slice(headerPos + key.length, pos);
        var nextPos = pos + key.length;
        var type = key;

        return [ body, nextPos, type ];
      }
    }
  } catch (e) {
    return ['', -1 ];
  }
  
  return ['', -1];
}

module.exports = getHeader;