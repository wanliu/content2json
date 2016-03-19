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
  = head:Factor tail:(_ ("*" / "/" / "%") _ Factor)* {
      var result = head, i;

      for (i = 0; i < tail.length; i++) {
        if (tail[i][1] === "*") { result *= tail[i][3]; }
        if (tail[i][1] === "/") { result /= tail[i][3]; }
        if (tail[i][1] === "%") { result %= tail[i][3]; }
      }

      return result;
    }

Factor
  = "(" _ expr:Logical _ ")" { return expr; }
  / '^' expr:Expression { return expr * expr; }
  / '+' Integer { return makeInteger(text()); }
  / '-' Integer { return makeInteger(text()); }
  / '!' expr:Logical { return !expr; }
  / Integer
  / Variable

String
  = [_a-zA-Z0-9]+ { return text(); }

Variable
  = name:('_'? String) {
    var valName = name[1];
    return options['content'][valName]; 
  }

Integer "integer"
  = [0-9]+ { return makeInteger(text()); }

_ "whitespace"
  = [ \t\n\r]*