var clouddatabase = require("clouddatabase");
var utils = require("../utils");
var colors = require("colors");
var async = require("async");

var instance = exports;

instance.usage = [
  'View Infomartion on current instances and add / delete instances'.cyan,
  '',

  'Usage:'.cyan.bold.underline,
  '',
  '  clouddatabase instance list',
  '',
  '  clouddatabase instance delete <instanceId>',
  '  clouddatabase instance create <instanceName> <flavorId/flavorRef> <dbSize> <databaseName>',
  '',
  '  clouddatabase instance resizeDisk <instanceName> <dbSize>',
  '  clouddatabase instance resizeFlavor <instanceName> <flavorId/flavorRef>',
  '',
  '  clouddatabase instance listDatabases <instanceName>',
  '  clouddatabase instance addDatabase <instanceName> <databaseName>',
  '  clouddatabase instance deleteDatabase <instanceName> <databaseName>',
  '',
  '  clouddatabase instance listUsers <instanceName>',
  '  clouddatabase instance addUser <instanceName> <username> <database1> <database2> ...',
  '  clouddatabase instance deleteUser <instanceName> <username>  (TODO)',
  ''
];

instance.list = function() {
	var self = this;
	self.log.info('List All Current Instances');
	self.log.info("ID\tName\tStatus");

	utils.getAuth(this, function(err, client) {
		client.getInstances(true, function(err, data) {
			data.forEach(function(item) {
				self.log.info(item.id +"\t"+item.name+"\t"+item.status);
			});
			//cb(null);
		});
	});
};


instance.create = function(instanceName, flavor, dbSize, dbName, cb) {
	var self = this;
	self.log.info('Create New Instance');

	if(!instanceName) {
		self.log.error("instanceName Required");
		cb(null);
		return;
	}

	if(!flavor) {
		self.log.error("flavor Required");
		cb(null);
		return;
	}

	if(!dbSize) {
		self.log.error("dbSize Required");
		cb(null);
		return;
	}

	if(!dbName) {
		self.log.error("dbName Required");
		cb(null);
		return;
	}

	self.log.info('Instance Name: ' + instanceName);
	self.log.info('Flavor: ' + flavor);
	self.log.info('Database Size: ' + dbSize);
	self.log.info('Database Name: ' + dbName);

	utils.getAuth(this, function(err, client) { // get auth
		client.addDatabase(flavor, dbSize, instanceName, dbName, function(err, data) { // add instance
			if(err) {
				self.log.error(err);
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

		});
	});
};


instance.delete = function(instanceName, cb) {
	var self = this;

	if(!instanceName) {
		self.log.error("instanceName Required");
		cb(null);
		return;
	}

	self.log.info('Delete Instance');
	self.log.info('Instance Name: ' + instanceName);

	findInstance(this, instanceName, function(err, item) {
		if(err) {
			self.log.error(err);
			cb(null);
			return;
		}
		item.deleteServer(function(err) { // delete the instace we just made
			if(err) {
				self.log.error("Error on delete: "+ err);
				cb(null);
				return;
			}
			self.log.info("Instance Deleted");
		});
	});
};

instance.resizeDisk = function(instanceName, size,  cb) {
	var self = this;
	if(!instanceName) {
		self.log.error("instanceName Required");
		cb(null);
		return;
	}
	if(!size) {
		self.log.error("size Required");
		cb(null);
		return;
	}
	self.log.info('Resize Instance Disk Space');
	self.log.info('Instance Name: ' + instanceName);
	self.log.info('New Disk Size: ' + size);

	findInstance(this, instanceName, function(err, item) {
		if(err) {
			self.log.error(err);
			cb(null);
			return;
		}
		item.resizeVolume({volume: { size: size } }, function(err) {
			if(err) {
				self.log.error("Error on disk resize: (currently only support volume increase) "+ err);
				cb(null);
				return;
			}
			self.log.info("Instance Resized - Awaiting Active State");
			item.setWait({ status: 'ACTIVE' }, 5000, function () { // server ready - print details
				item.getDetails(function(err, items) {
					self.log.info("Instance Ready");
					self.log.info("Instance Id: " + item.id);
					self.log.info("Instance Hostname: " + item.hostname);
					self.log.info("Instance Size: " + item.volume.size);
					cb(null);
				});
			});
		});
	});
};



instance.resizeFlavor = function(instanceName, flavorId,  cb) {
	var self = this;
	if(!instanceName) {
		self.log.error("instanceName Required");
		cb(null);
		return;
	}
	if(!flavorId) {
		self.log.error("flavorId Required");
		cb(null);
		return;
	}
	self.log.info('Resize Instance Disk Space');
	self.log.info('Instance Name: ' + instanceName);
	self.log.info('New Flavor Id: ' + flavorId);

	findInstance(this, instanceName, function(err, item) {
		if(err) {
			self.log.error(err);
			cb(null);
			return;
		}
		item.resizeFlavor({flavorRef: flavorId}, function(err) {
			if(err) {
				self.log.error("Error on flavor resize: "+ err);
				cb(null);
				return;
			}
			self.log.info("Instance Flavor Resized - Awaiting Active State");
			item.setWait({ status: 'ACTIVE' }, 5000, function () { // server ready - print details
				item.getDetails(function(err, items) {
					self.log.info("Instance Ready");
					self.log.info("Instance Id: " + item.id);
					self.log.info("Instance Hostname: " + item.hostname);
					self.log.info("Instance Flavor: " + item.flavor.id);
					cb(null);
				});
			});
		});
	});
};


instance.listDatabases = function(instanceName, cb) {
	var self = this;

	if(!instanceName) {
		self.log.error("instanceName Required");
		cb(null);
		return;
	}

	self.log.info('List Databases: ' + instanceName);

	findInstance(this, instanceName, function(err, item) {
		if(err) {
			self.log.error(err);
			cb(null);
			return;
		}
		item.getDatabases(function(err, databasesObj) {
			if(err) {
				self.log.error("Error on database List: "+ err);
				cb(null);
				return;
			}
			if(!databasesObj) {
				self.log.error("No Databases Found");
				cb(null);
				return;
			}
			databases = JSON.parse(databasesObj).databases;
			databases.forEach(function(val) {
			 	self.log.help(val.name);
			});
			cb(null);
		});
	});
};


instance.addDatabase = function(instanceName, databaseName, cb) {
	var self = this;

	if(!instanceName) {
		self.log.error("instanceName Required");
		cb(null);
		return;
	}

	if(!databaseName) {
		self.log.error("databaseName Required");
		cb(null);
		return;
	}

	self.log.info('Add Database: ');
	self.log.info('Instance Name: ' + instanceName);
	self.log.info('Database Name: ' + databaseName);


	findInstance(this, instanceName, function(err, item) {
		if(err) {
			self.log.error(err);
			cb(null);
			return;
		}
		var options = [{
			name: databaseName
		}];

		item.addDatabase(options, function(err) {
			if(err) {
				self.log.error("Error on database Create: "+ err);
				cb(null);
				return;
			}
		 	self.log.info("Database Added");
		});
	});
};

instance.deleteDatabase = function(instanceName, databaseName, cb) {
	var self = this;

	if(!instanceName) {
		self.log.error("instanceName Required");
		cb(null);
		return;
	}

	if(!databaseName) {
		self.log.error("databaseName Required");
		cb(null);
		return;
	}

	self.log.info('Delete Database: ');
	self.log.info('Instance Name: ' + instanceName);
	self.log.info('Database Name: ' + databaseName);


	findInstance(this, instanceName, function(err, item) {
		if(err) {
			self.log.error(err);
			cb(null);
			return;
		}

		item.deleteDatabase(databaseName, function(err) {
			if(err) {
				self.log.error("Error on database Delete: "+ err);
				cb(null);
				return;
			}
		 	self.log.info("Database Deleted");
		});
	});
};


instance.listUsers = function(instanceName, cb) {
	var self = this;

	if(!instanceName) {
		self.log.error("instanceName Required");
		cb(null);
		return;
	}

	self.log.info('List Users: ' + instanceName);

	findInstance(this, instanceName, function(err, item) {
		if(err) {
			self.log.error(err);
			cb(null);
			return;
		}
		item.getUsers(function(err, userObj) {
			if(err) {
				self.log.error("Error on user List: "+ err);
				cb(null);
				return;
			}
			if(!userObj) {
				self.log.error("No Users Found");
				cb(null);
				return;
			}
			users = JSON.parse(userObj).users;
			users.forEach(function(val) {
				self.log.help(val.name);
			});
			cb(null);
		});
	});
};

instance.addUser = function() {
	var args = Array.prototype.slice.call(arguments);
	var instanceName = args.shift();
	var username = args.shift();
	var cb = args.pop();
	var databaseList = args;

	var self = this;

	if(!instanceName || typeof(instanceName) === "function") {
		self.log.error("instanceName Required");
		return;
	}

	if(!username || typeof(username) === "function") {
		self.log.error("username Required");
		return;
	}

	if(!databaseList || typeof(databaseList) === "function") {
		self.log.error("databases Required");
		return;
	}

	self.log.info('Add User: ' + instanceName);
	self.log.info('Username: ' + username);
	self.log.info('Access To: ' + databaseList.join(", "));

	var databases = [];

	databaseList.forEach(function(val) {
		databases.push({name:val});
	})

	self.prompt.get('password', function (err, result) {
		if(err) {
			self.log.error(err);
			cb(null);
			return;
		}
		if(!result.password) {
			self.log.error("Please enter a password");
			cb(null);
			return;
		}
		var password = result.password;

		findInstance(self, instanceName, function(err, item) {
			if(err) {
				self.log.error(err);
				cb(null);
				return;
			}

			var options = [{
				name: username,
				password: password,
				databases: databases
			}];

			item.addUser(options, function(err) {
				if(err) {
					console.log("Error on add: "+ err);
					return;
				}
				self.log.info("User Added")
			});
		});
	});
};

instance.deleteUser = function(instanceName, username, cb) {
	var self = this;

	if(!instanceName) {
		self.log.error("instanceName Required");
		cb(null);
		return;
	}

	if(!username) {
		self.log.error("username Required");
		cb(null);
		return;
	}

	self.log.info('Delete Database: ');
	self.log.info('Instance Name: ' + instanceName);
	self.log.info('username: ' + username);


	findInstance(this, instanceName, function(err, item) {
		if(err) {
			self.log.error(err);
			cb(null);
			return;
		}

		item.deleteUser(username, function(err) {
			if(err) {
				self.log.error("Error on user Delete: "+ err);
				cb(null);
				return;
			}
		 	self.log.info("User Deleted");
		});
	});
};

findInstance = function(self, instanceName, cb) {
	var instance;
	utils.getAuth(self, function(err, client) { // get auth
		client.getInstances(true, function(err, data) { // get all server instances
			async.forEach(data, function(item, callback) {
				if(item.id == instanceName) { // on the one requested - request delete
					instance = item;
				}
				process.nextTick(callback);
			}, function(err) {
				if(!instance) {
					cb("No Instance Found");
				} else {
					cb(null, instance);
				}
			});
		});
	});
}

