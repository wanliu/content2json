var util = require('util');
require('../misc');

function defaultSort(a, b) {
  var aData = a.data || {}, bData = b.data || {};
  var aDate = Date.parse(aData['date']);
  var bDate = Date.parse(bData['date']);
  
  return bDate - aDate;    
}

function sortAlgor(a, b, fac) {
  try {
    if (util.isNumber(a)) {
      factor = Math.max(a, b) * fac;
      return (a - b) / factor;
    } else if (util.isDate(a)) {
      factor = Math.max(a, b) * fac;
      return (a - b) / factor;
    } else if (util.isString(a)) {
      return (a > b ? 1 : a < b ? -1 : 0) / fac;
    }
  } catch (e) {
    return 0;
  }
}

function sortAlgorNumberify(a, b, fac) {
  return sortAlgor(parseFloat(a), parseFloat(b), fac);
}

function convert2Date(dat) {
  if (typeof dat === 'number') {
    return new Date(date)
  } else if (typeof dat === 'string') {
    return Date.parse(dat);
  } else if (util.isDate(dat)) {
    return dat;
  } else {
    return new Date(0);    
  } 
}

function sortAlgorDatify(a, b, fac) {
  a = convert2Date(a), b = convert2Date(b);
  return sortAlgor(a, b, fac);
}

function sortAlgorStringify(a, b, fac) {
  return sortAlgor(a.toString(), b.toString(), fac);
}

var SortAlgorithm = {
  default: sortAlgor,
  number: sortAlgorNumberify,
  date: sortAlgorDatify,
  string: sortAlgorStringify
};

function parseSorter(sort) {
  var terms = []; 
  
  function up(a, b) {
    return [a, b];
  }
  
  function down(a, b) {
    return [b, a];
  }
  
  terms = sort.split(',').map(function(t) {
    t = t.trim()
    var _ref = t.split(' '), name = _ref[0], after = typeof _ref[1] === 'undefined' ? '' :_ref[1];
    
    _ref = after.split('#'), order = _ref[0], convert = _ref[1];
    order = !order || typeof order === 'undefined' ? 'asc' : order;
    
    if (order === 'asc') {
      direction = up;
    } else if (order === 'desc') {
      direction = down;
    } else {
      throw new Error('Invalid order argument `' + order); 
    }
    
    return {
      name: name,
      direction: direction,
      convert: convert ? convert : 'default'
    };   
  });
   
  return function sorter(a, b) {
    var aData = a.data || {}, bData = b.data || {};
    var factor;
    
    s = 0;
    for (var j = 0; j < terms.length; j++ ) {
      var t = terms[j];
      var algor = t.convert || 'default';
      var direction = t.direction;
      var _ref =  direction(aData[t.name], bData[t.name]), a = _ref[0], b = _ref[1];
      
      s += SortAlgorithm[algor](a, b, Math.pow(10, j));
      // s += sortAlgor(a, b, Math.pow(10, j));
    }
    
    return s; 
  }
}

module.exports = {
  parser: parseSorter,
  default: defaultSort,
  SortAlgorithm: SortAlgorithm,
  sortAlgor: sortAlgor,
  sortAlgorNumberify: sortAlgorNumberify,
  sortAlgorDatify: sortAlgorDatify,
  sortAlgorStringify: sortAlgorStringify
};