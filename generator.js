'use strict';
var generator = require('./generator_base'),
	prompt = require("prompt"),
	argv = require('yargs').argv,
	createModule = function(module) {
		generator.genTemplate({ type: 'index', module: module });
	},
	genTemplate = function(module, type, typeName) {
		generator.genTemplate({ type: type, typeName: typeName, module: module });
	},
	genRoute = function(name, url, controller, templateUrl, isNav) {
		generator.genRoute({ name: name, url: url, controller: controller, templateUrl: templateUrl, isNav: isNav });
	},
	genDialogRoute = function(name, controller, templateUrl, windowClass, size) {
		generator.genDialogRoute({ name: name, controller: controller, templateUrl: templateUrl, windowClass: windowClass, size: size });
	};

(function() {
	prompt.get([{
    name: 'flag',
    description: 'Do you want to create route(y/n)',
    type: 'string',
    required: true,
    conform: function(flag) {
      return (flag.toLowerCase() === 'y' || flag.toLowerCase() === 'n');
    }
  }], function (err, result) {
    if (result.flag.toLowerCase() === 'y') {
    	prompt.get([{
		    name: 'dialog',
		    description: 'Do you want to create dialog(y/n)',
		    type: 'string',
		    required: true,
		    conform: function(flag) {
		      return (flag.toLowerCase() === 'y' || flag.toLowerCase() === 'n');
		    }
		  }], function (err, result) {
		  	if (result.dialog.toLowerCase() === 'y') {
		  		prompt.get([{
				    name: 'name',
				    description: 'Please input name',
				    type: 'string',
				    required: true
				  }, {
				    name: 'controller',
				    description: 'Please input controller',
				    type: 'string',
				    required: true
				  }, {
				    name: 'templateUrl',
				    description: 'Please input templateUrl',
				    type: 'string',
				    required: true
				  }, {
				    name: 'windowClass',
				    description: 'Please input windowClass',
				    type: 'string'
				  }, {
				    name: 'size',
				    description: 'Please input size',
				    type: 'string'
				  }], function (err, results) {
				    	genDialogRoute(results.name, results.controller, results.templateUrl, results.windowClass, results.size);
				  });
		  	} else {
		  		prompt.get([{
				    name: 'name',
				    description: 'Please input name',
				    type: 'string',
				    required: true
				  }, {
				    name: 'url',
				    description: 'Please input url',
				    type: 'string',
				    required: true
				  }, {
				    name: 'controller',
				    description: 'Please input controller',
				    type: 'string',
				    required: true
				  }, {
				    name: 'templateUrl',
				    description: 'Please input templateUrl',
				    type: 'string',
				    required: true
				  }, {
				    name: 'isNav',
				    description: 'Is it nav(y/n)',
				    type: 'string',
				    required: true,
				    conform: function(hasUrl) {
				      return (hasUrl.toLowerCase() === 'y' || hasUrl.toLowerCase() === 'n');
				    }
				  }], function (err, results) {
				    	genRoute(results.name, results.url, results.controller, results.templateUrl, results.isNav.toLowerCase() === 'y');
				  });
		  	}
		  });
    } else {
    	prompt.get([{
		    name: 'module',
		    description: 'Please input module',
		    type: 'string',
		    required: true
		  }, {
		    name: 'controller',
		    description: 'Please input controller',
		    type: 'string',
		  }, {
		    name: 'service',
		    description: 'Please input service',
		    type: 'string',
		  }, {
		    name: 'factory',
		    description: 'Please input factory',
		    type: 'string',
		  }, {
		    name: 'filter',
		    description: 'Please input filter',
		    type: 'string',
		  }, {
		    name: 'directive',
		    description: 'Please input directive',
		    type: 'string',
		  }], function (err, results) {
		    	createModule(results.module);

					if (results.controller) {
						genTemplate(results.module, 'controller', results.controller);
					}

					if (results.factory) {
						genTemplate(results.module, 'factory', results.factory);
					}

					if (results.service) {
						genTemplate(results.module, 'service', results.service);
					}

					if (results.directive) {
						genTemplate(results.module, 'directive', results.directive);
					}

					if (results.filter) {
						genTemplate(results.module, 'filter', results.filter);
					}
		  });
    }
  });
})();
