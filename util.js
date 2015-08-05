
var outs = {
	camel: function() {
		var sources = Array.prototype.slice.call(arguments, 0),
			name = '';

	  sources.forEach(function (source, i) {
	    if (source) {
	      if (i) {
	      	source = source.toLowerCase();
	      	name += source.substr(0, 1).toUpperCase() + source.substr(1);
	      } else {
	      	name += source.toLowerCase();
	      }
	    }
	  });

	  return name;
	}
};

module.exports = outs;