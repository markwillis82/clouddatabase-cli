var clouddatabase = require("clouddatabase");
var utils = require("../utils");
var colors = require('colors');

var flavor = exports;

flavor.usage = [
  'Display info on instance flavors'.cyan,
  '',

  'Usage:'.cyan.bold.underline,
  '',
  '  clouddatabase flavor list',
  ''
];

flavor.list = function(cb) {
	var self = this;
	self.log.info('List All Flavors');
	self.log.info("ID\tName");

	utils.getAuth(this, function(err, client) {
		client.getFlavors(function(err, data) {
			data.forEach(function(item) {
				self.log.info(item.id +"\t"+item.name);
			});
			cb(null);
		});
	});
}
