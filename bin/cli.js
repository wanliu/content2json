#!/usr/bin/env node

var parseArgs = require('minimist')
// var exec = require('child_process').execFile;
var exec = require('exec');
var Parser = require('../lib/parser');
var debug = require('debug')('Content2Json');

function usage() {
  
  output = "Usage: content2json [options]\n\n" +
           "Options:\n" +
           "   -h, --help               Help this tools\n" +
           "   -m, --markdown=filename  Input to convert json Markdown files\n" +
           "   -r, --sort='fields,...'  Sort the per content\'s front-matter expression\n\n" + 
           "                              Example:\n" +
           "                                --sort='price desc#number, date'\n\n" +
           "                              # => sort price as number with order desc and\n" +
           "                              second order with date order by default asc\n\n" +
           "   -f, --filter             Filter every search select valid row with contents\n\n" +
           "                              Example:\n" +
           "                                --filter='price >= 60'\n\n" +
           "                              # => content['price'] >= 60\n\n" +
           "   -s, --schema             Output format, contains: 'array, full, file'\n";
           "   -e, --execute            Execute a shell script, or program with every json\n";
           "   --ignore null            Ignore parse value is null error\n";
           "   -v, --verbose            Print debugging information\n";

  console.log(output);
}

function main() {
  try {
    var argv = parseArgs(process.argv);
    
    if (argv.h || argv.help) return usage();
    
    var results = Parser.parse(argv);
    var execArg = argv.e || argv.execute;
    
    if (execArg) {
      results.forEach(function(result) {
        var cmdStr = execArg.replace(/\$\d+/, function(m) {
          console.log(m);
          if (m === '$1') {
            return "'" + JSON.stringify(result) + "'";   
          } else {
            return '';
          }
        });
        
        console.log(cmdStr);
        exec(cmdStr, function(err, stdout, stderr) {
          if (err) {
            throw err;
          }
          console.log(stdout);          
        });
      });
    } else {
      if (argv.count) {
        console.log(results.length);
      } else {
        console.log(results);
      }    
    }
  } catch(e) {
    console.error(e.stack);
    usage();
  }
}

main();
