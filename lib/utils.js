var clouddatabase = require("clouddatabase");


var utils = exports;


utils.getAuth = function(self, cb) {
	var options = {
		auth: {
			username: self.config.get("cloudUsername"),
			apiKey: self.config.get("cloudApiKey"),
			accountNumber: self.config.get("cloudAccountNumber")
		}
	}
	//console.log(options);


	var client = clouddatabase.createClient(options);

	client.setAuth(function(err, data) {
		cb(err, client);
	});
}
