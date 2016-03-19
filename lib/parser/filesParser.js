var fs = require('fs');
var path = require('path');

var merge = require('merge-deep');
var glob = require('glob');
var TOML = require('toml');
var YAML = require('yamljs');
var getHeader = require('../header');

function parseFiles(globFiles) {
  var files = glob.sync(globFiles);
    
  results = files.map(function (file) {
    var result = {
      fullpath: path.resolve(file),
      filename: path.basename(file)
    };
    
    try {
      data = fs.readFileSync(file, { encoding: 'utf8' });
      var pos = 0, header, type, _ref;
          
      while ((_ref = getHeader(data, pos), pos = _ref[1]) &&  pos >=0) {
        header = _ref[0], type = _ref[2];
        var json;
          
        switch(type) {
          case '+++': // toml
            json = TOML.parse(header);
            break;
          case '---': // yaml
            json = YAML.parse(header);
            break;
          case '{': // json
            json = JSON.parse('{' + header + '}');
            break;
          default: // error
            console.error(new Error('invalid format'));
            return ;
        }
        
        
        if (result['data']) {
          result['data'] = merge(result['data'], json);
        } else {
          result['data'] = json;
        }
      }
    } catch (e) {
      console.error(e.stack);
    }

    return result;
  });
  
  return results;  
}

module.exports = {
  parser: parseFiles,
}