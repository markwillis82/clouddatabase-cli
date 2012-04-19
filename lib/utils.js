var clouddatabase = require("clouddatabase");


var utils = exports;
var client = clouddatabase.createClient(options);


utils.getAuthToken = function() {}

utils.getAuth = function(cb) {
	client.setAuth(cb);
}
