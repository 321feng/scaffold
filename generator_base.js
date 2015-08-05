'use strict';
var fs = require('fs'),
	util = require('./util'),
	getConfig = function(type) {
		if ('controller' === type) {
			return {
				templateFile: './templates/controller.coffee',
				typeRegex: /{ctrl}/
			};
		} else if ('service' === type) {
			return {
				templateFile: './templates/service.coffee',
				typeRegex: /{service}/
			};
		} else if ('factory' === type) {
			return {
				templateFile: './templates/factory.coffee',
				typeRegex: /{factory}/
			};
		} else if ('filter' === type) {
			return {
				templateFile: './templates/filter.coffee',
				typeRegex: /{filter}/
			};
		} else if ('directive' === type) {
			return {
				templateFile: './templates/directive.coffee',
				typeRegex: /{directive}/
			};
		} else if ('index' === type) {
			return {
				templateFile: './templates/index.coffee',
				coffeeFileName: 'index.coffee'
			};
		} else if ('route' === type) {
			return {
				templateFile: './templates/route.coffee'
			};
		} else if ('dialog' === type) {
			return {
				templateFile: './templates/dialog_route.coffee'
			};
		}
	},
	getParentDirectory = function(type) {
		if ('controller' === type) {
			return 'controllers';
		} else if ('service' === type) {
			return 'services';
		} else if ('filter' === type) {
			return 'filters';
		} else if ('factory' === type) {
			return 'factories';
		} else if ('directive' === type) {
			return 'directives';
		} else {
			return '';
		}
	},
	getFileName = function(type, typeName, modules) {
		if ('controller' === type) {
			return util.camel.apply(null, [typeName, 'Controller']);
		} else if ('service' === type) {
			return util.camel.apply(null, [typeName, 'Service']);
		} else if ('filter' === type) {
			return util.camel.apply(null, [typeName, 'Filter']);
		} else if ('directive' === type) {
			return util.camel.apply(null, [typeName, 'Directive']);
		}  else if ('factory' === type) {
			return util.camel.apply(null, [typeName, 'Factory']);
		} else if ('index' === type) {
			return 'index';
		}
	},
	getTypeName = function(type, typeName, modules) {
		if ('controller' === type) {
			return util.camel.apply(null, [].concat(modules).concat([typeName, 'Controller']));
		} else if ('service' === type) {
			return util.camel.apply(null, [].concat(modules).concat([typeName, 'Service']));
		} else if ('filter' === type) {
			return util.camel.apply(null, [].concat(modules).concat([typeName, 'Filter']));
		} else if ('directive' === type) {
			return util.camel.apply(null, [].concat(modules).concat([typeName, 'Directive']));
		}  else if ('factory' === type) {
			return util.camel.apply(null, [].concat(modules).concat([typeName, 'Factory']));
		} else if ('index' === type) {
			return 'index';
		}
	},
	genTemplate = function(obj) {
		var config = getConfig(obj.type),
			templateContent = fs.readFileSync(config.templateFile, 'utf-8'),
			module_r = /{module}/;

		var modules = Array.prototype.slice.call(obj.module.split('.'), 0);
		templateContent = templateContent.replace(module_r, util.camel.apply(null, modules));

		if ('index' !== obj.type) {
			templateContent = templateContent.replace(config.typeRegex, getTypeName(obj.type, obj.typeName, modules));
		}

		var scriptDir = '../src/scripts/',
			scriptModuleDir = scriptDir,
			scriptFile = '';

		try {
			var dirs = (obj.type === 'index' ? modules : [].concat(modules).concat([getParentDirectory(obj.type)]));
			dirs.forEach(function(dir) {
				scriptModuleDir += dir + '/';
				if (!fs.existsSync(scriptModuleDir)) {
					fs.mkdirSync(scriptModuleDir);
				}
			});

			scriptFile = scriptModuleDir + getFileName(obj.type, obj.typeName, modules) + '.coffee';

			if (!fs.existsSync(scriptFile)) {
				var fd = fs.openSync(scriptFile, 'w+');
				fs.writeFileSync(scriptFile, templateContent);
				fs.closeSync(fd);
			}
		} catch (e) {
			throw e;
		}
	},
	genRoute = function(obj) {
		var config = getConfig('route'),
			templateContent = fs.readFileSync(config.templateFile, 'utf-8'),
			name_r = /{name}/,
			url_r = /{url}/,
			isNav_r = /{isNav}/,
			templateUrl_r = /{templateUrl}/,
			ctrl_r = /{ctrl}/;

		templateContent = templateContent.replace(name_r, obj.name);
		templateContent = templateContent.replace(ctrl_r, obj.controller);
		templateContent = templateContent.replace(templateUrl_r, obj.templateUrl);
		templateContent = templateContent.replace(isNav_r, obj.isNav || false);
		templateContent = templateContent.replace(url_r, obj.url);

		var scriptFile = '../src/scripts/route/routes.coffee';

		try {
			var fileContent = fs.readFileSync(scriptFile, 'utf-8');
			fileContent = fileContent.replace(/^]$/gm, templateContent + '\r\n]');

		  fs.writeFile(scriptFile, fileContent, function (err) {
		    if (err) {
		      throw err;
		    }
		  });
		} catch (e) {
			throw e;
		}
	},
	genDialogRoute = function(obj) {
		var config = getConfig('dialog'),
			templateContent = fs.readFileSync(config.templateFile, 'utf-8'),
			name_r = /{name}/,
			templateUrl_r = /{templateUrl}/,
			ctrl_r = /{ctrl}/,
			windowClass_r = /{windowClass}/,
			size_r = /{size}/,
			windowClass_r2 = /\n^.+'{windowClass}'$/gm,
			size_r2 = /\n^.+'{size}'$/gm,

		templateContent = templateContent.replace(name_r, obj.name);
		templateContent = templateContent.replace(ctrl_r, obj.controller);
		templateContent = templateContent.replace(templateUrl_r, obj.templateUrl);

		if (obj.windowClass) {
			templateContent = templateContent.replace(windowClass_r, obj.windowClass);
		} else {
			templateContent = templateContent.replace(windowClass_r2, '');
		}

		if (obj.size) {
			templateContent = templateContent.replace(size_r, obj.size);
		} else {
			templateContent = templateContent.replace(size_r2, '');
		}

		var scriptFile = '../src/scripts/route/dialogs.coffee';

		try {
			var fileContent = fs.readFileSync(scriptFile, 'utf-8');
			console.log(fileContent);
			console.log(templateContent);
			fileContent = fileContent.replace(/^}$/gm, templateContent + '\r\n}');
			console.log(fileContent);
		  fs.writeFile(scriptFile, fileContent, function (err) {
		    if (err) {
		      throw err;
		    }
		  });
		} catch (e) {
			throw e;
		}
	};

module.exports = {
	genTemplate: genTemplate,
	genRoute: genRoute,
	genDialogRoute: genDialogRoute
};
