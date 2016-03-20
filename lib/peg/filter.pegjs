/*
 * Simple Logical Grammar
 * ==========================
 *
 * Accepts expressions like "2 * (3 + 4) > 3" and computes their value.
 */

{
  function makeInteger(o) {
    return parseInt(o, 10);
  }
  
  var Errors = {
    null: 'ignoreNull'
  }
  
  function ignoreError(error, cb) {
    var isIgnore = options[Errors[error]];
     
    try {
      return cb()
    } catch (e) {
      if (isIgnore) {
        return null;
      } else {
        throw e;
      }
    }  
  }
}

Logical "Logical expression"
  = head:Comparable tail:(_ ( "&&" / "and" / "||" / "or") _ Comparable)* {
    var result = head, i;

    for (i = 0; i < tail.length; i++) {
      if (tail[i][1] === "and" ) { result = result && tail[i][3]; }
      if (tail[i][1] === "&&" ) { result = result && tail[i][3]; }
      if (tail[i][1] === "or" ) { result = result || tail[i][3]; }
      if (tail[i][1] === "||" ) { result = result || tail[i][3]; }
    }

    return result;
  }

Comparable "Comparison operation"
  = head:Expression tail:(_ ( ">=" / "<=" / ">" / "<" / "==" ) _ Expression)* {
    var result = head, i;
    for (i = 0; i < tail.length; i++) {
      if (tail[i][1] === ">=" ) { result = result >= tail[i][3]; }
      if (tail[i][1] === "<=" ) { result = result <= tail[i][3]; }
      if (tail[i][1] === "==" ) { result = result == tail[i][3]; }
      if (tail[i][1] === ">") { result = result > tail[i][3]; }
      if (tail[i][1] === "<") { result = result < tail[i][3]; }
    }

    return result;
  }

Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
      var result = head, i;

      for (i = 0; i < tail.length; i++) {
        if (tail[i][1] === "+") { result += tail[i][3]; }
        if (tail[i][1] === "-") { result -= tail[i][3]; }
      }

      return result;
    }

Term
  = head:Subscript tail:(_ ("*" / "/" / "%") _ Subscript)* {
      var result = head, i;

      for (i = 0; i < tail.length; i++) {
        if (tail[i][1] === "*") { result *= tail[i][3]; }
        if (tail[i][1] === "/") { result /= tail[i][3]; }
        if (tail[i][1] === "%") { result %= tail[i][3]; }
      }

      return result;
    }

Subscript "Variable subscript"
  = head:Reference tail:("[" _ Integer _ "]")* {
    var parent = head, i;    
    var content = options['content'];
  
    return ignoreError('null', function() {
      for (i = 0; i < tail.length; i++) {
        var index = tail[i][2];
        parent = parent[index];
      }
      
      return parent;
    });     
  }

Reference "Member of Expression"
  = head:Index tail:("." Literal)* {
    var parent = head, i;
    
    return ignoreError('null', function() {
    
      for (i = 0; i < tail.length; i++) {
        var valName = tail[i][1][1];
        parent = parent[valName];
      }
    
      return parent;
    });    
  }

Index "Array index operator"
  = head:Factor tail:("[" _ Integer _ "]")* {
    var parent = head, i;    
    var content = options['content'];

    return ignoreError('null', function() {

      for (i = 0; i < tail.length; i++) {
        var index = tail[i][2];
        parent = parent[index];
      }
      
      return parent;
    });      
  }
  
Factor
  = "(" _ expr:Logical _ ")" { return expr; }
  / '^' expr:Expression { return expr * expr; }
  / '+' Integer { return makeInteger(text()); }
  / '-' Integer { return makeInteger(text()); }
  / '!' expr:Logical { return !expr; }
  / StringLiteral
  / Integer
  / Pointer
  / Variable

Pointer
  = head:Variable tail:("." child:Literal)* {
    var parent = head, i;
    var content = options['content'];

    return ignoreError('null', function() {
    
      for (i = 0; i < tail.length; i++) {
        var valName = tail[i][1][1];
        parent = parent[valName];
      } 
      return parent;
    });
  }
  
StringLiteral
  = Quotation tail:(!'"' .)* Quotation { 
	  var i;
    var str = '';
  	for (i = 0; i < tail.length; i++) {
      str += tail[i][1];
    }
  	return str;
  }
  
String
  = [_a-zA-Z0-9]+ { return text(); }

Variable
  = name:('_'? String) {
    var valName = name[1];
    return options['content'][valName]; 
  }

Literal
  = name:('_'? String) 
  
Integer "integer"
  = [0-9]+ { return makeInteger(text()); }

_ "whitespace"
  = [ \t\n\r]*

Quotation 
  = '"'