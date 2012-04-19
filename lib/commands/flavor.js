var clouddatabase = require("clouddatabase");
//var utils = require("../utils");
var flavor = exports;







flavor.usage = [
  'list flavor'
];

flavor.list = function(cb) {
	var self = this;
	self.log.info('List All Flavors');
	self.log.info("ID\tName");

	flavor.getAuth(this, function(err, data) {
		data.forEach(function(item) {
			self.log.info(item.id +"\t"+item.name);
		});
		cb(null);
	})
}

flavor.getAuth = function(self, cb) {
	var options = {
		auth: {
			username: self.config.get("cloudUsername"),
			apiKey: self.config.get("cloudApiKey"),
			accountNumber: self.config.get("cloudAccountNumber")
		}
	}
	//console.log(options);


	var client = clouddatabase.createClient(options);


	client.setAuth(function(err, res) {
		//console.log(res);
		client.getFlavors(cb);
	});
}
