function ArrayPiper(array) {
  this.array = array;
  this.pipes = [];
  
}

ArrayPiper.prototype.pipe = function(handle) {
  this.pipes.push(handle);
  // this.array = handle(this.array);
  return this;
}

ArrayPiper.prototype.result = function() {
  var context = this.array;
  
  for (var i = 0; i < this.pipes.length; i++) {
    var handle = this.pipes[i];
    
    context = handle(context);
  }
  
  return context; 
}

module.exports = ArrayPiper;