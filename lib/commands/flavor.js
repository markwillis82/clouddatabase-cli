var clouddatabase = require("clouddatabase");
var utils = require("../utils");

var flavor = exports;

flavor.usage = [
  'list flavor'
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
