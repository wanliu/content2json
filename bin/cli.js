#!/usr/bin/env node

var fs = require('fs');
var util = require('util');
var parseArgs = require('minimist')
var TOML = require('toml');
var YAML = require('yamljs');
var merge = require('merge-deep');

var glob = require('glob');
var parseHeader = require('../index').parseHeader;

var argv = parseArgs(process.argv);

if (argv.parse) {
  // files = argv.parse;

  console.log(parseFiles(argv.parse));  
}



// if (argv.sortBy) {
  
// }

// if (argv.filter) {
  
// }

function parseFiles(globFiles) {
  var results = 
  glob(globFiles, function (err, files) {
    if (err) {
      return console.error(err.stack);
    }

    files.forEach(function (file) {
      try {
        data = fs.readFileSync(file, { encoding: 'utf8' });
        var pos = 0, header, type, _ref;
            
        while ((_ref = parseHeader(data, pos), pos = _ref[1]) &&  pos >=0) {
          header = _ref[0], type = _ref[2];
          var result;
           
          switch(type) {
            case '+++': // toml
              result = TOML.parse(header);
              break;
            case '---': // yaml
              result = YAML.parse(header);
              break;
            case '{': // json
              result = JSON.parse('{' + header + '}');
              break;
            default: // error
              console.error(new Error('invalid format'));
              return ;
          }
          
          
          if (results[file]) {
            results[file] = merge(results[file], result);
          } else {
            results[file] = result;
          }
          
          // console.log(data.slice(pos))
          // pos += type.length;
        }
      } catch (e) {
        console.error(e.stack);
      }
    });
    
  });
  return results;  
}