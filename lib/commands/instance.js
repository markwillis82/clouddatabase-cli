var clouddatabase = require("clouddatabase");
var utils = require("../utils");
var colors = require('colors');

var instance = exports;

instance.usage = [
  'View Infomartion on current instances and add / delete instances'.cyan,
  '',

  'Usage:'.cyan.bold.underline,
  '',
  '  clouddatabase instance list',
  '  clouddatabase instance delete <instanceId>',
  '  clouddatabase instance create <instanceName> <flavorId/flavorRef> <dbSize> <databaseName>',
  ''
];

instance.list = function(cb) {
	var self = this;
	self.log.info('List All Current Instances');
	self.log.info("ID\tName\tStatus");

	utils.getAuth(this, function(err, client) {
		client.getInstances(true, function(err, data) {
			data.forEach(function(item) {
				self.log.info(item.id +"\t"+item.name+"\t"+item.status);
			});
			cb(null);
		});
	});
}


instance.create = function(instanceName, flavor, dbSize, dbName, cb) {
	var self = this;
	self.log.info('Create New Instance');
	self.log.info('Instance Name: ' + instanceName);
	self.log.info('Flavor: ' + flavor);
	self.log.info('Database Size: ' + dbSize);
	self.log.info('Database Name: ' + dbName);

	utils.getAuth(this, function(err, client) { // get auth
		client.addDatabase(flavor, dbSize, instanceName, dbName, function(err, data) { // add instance
			if(err) {
				self.log.error(err);
				cb(null);
				return;
			}
			var server = JSON.parse(data).instance;
			self.log.info("Instance Created - waiting for active status");

			client.getInstances(true, function(err, data) { // get all server instances
				data.forEach(function(item) {
					if(item.id == server.id) { // on the new one - start the wait
						item.setWait({ status: 'ACTIVE' }, 5000, function () { // server ready - print details
							self.log.info("Instance Ready");
							self.log.info("Instance Id: " + server.id);
							self.log.info("Instance Hostname: " + server.hostname);
							self.log.info("Instance Size: " + server.volume.size);
						});
					}
				});
			});





			cb(null);
		});
	});
}
