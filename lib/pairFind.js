function pairFind(str, chr) {
  var found = 0;
  for (var i = 0; i < str.length; i ++) {
    var c = str.slice(i, i + chr.length);
    if (c === chr) {
      found = i + chr.length;
      break;
    }
  }
  
  if (found > 0) { 
    return _find(str, chr, found);
  } else {
    return -1;
  }
}

var parts = { '[': ']', '{': '}', '(': ')', '"':'"', "'": "'", "+++": "+++", "---": "---" };
var reveseParts =  { ']': '[', '}': '{', ')': '(', '"':'"', "'": "'", "+++": "+++", "---": "---" };
var enters = ['[', '{', '('];
var leaves = [']', '}', ')', '+++', '---'];

function _find(str, chr, pos, stack) {
  if (typeof stack === 'undefined') { stack = [chr]; } 
  var part;
  
  for(var i = pos; i < str.length; i ++) {
    var nest = false;
    
    for (var j = 0; j < enters.length; j++) { // nest
      var enter = enters[j];
      var c = str.slice(i, i + enter.length);
      
      if (c === enter) {
        stack.push(c);
        nest = true;
        break;
      } else {
        continue;
      }
    }
    
    if (!nest) {
      for (var k = 0; k < leaves.length; k++) { // part!
        var leave = leaves[k];
        var c = str.slice(i, i + leave.length);
        
        if (c === leave) {
          part = stack.pop();
          if (part === reveseParts[c]) { // part!
            if (stack.length > 0) {
              break;        
            } else {
              return i;
            }        
          } else {
            throw new Error('invalid part match');
          }      
        }
      }   
    }
  }
  
  return -1;
}

module.exports = pairFind;