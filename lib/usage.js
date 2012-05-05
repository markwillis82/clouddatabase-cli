var colors = require('colors');

module.exports = [
	'Cloud Database Command Line Tool'.cyan,

	'',

	'Usage:'.cyan.bold.underline,
	'',
	'  clouddatabase <resource> <action> <param1> <param2> ...',
	'',

	'Common Use:'.cyan.bold.underline,
	'',

	'Add Config Username'.cyan,
	'  clouddatabase config set cloudUsername <username>',
	'',

	'Add Config apiKey'.cyan,
	'  clouddatabase config set cloudApiKey <apiKey>',
	'',

	'Add Config AccountNumber'.cyan,
	'  clouddatabase config set cloudAccountNumber <accountNumber>',
	'',

	'List Flavor Instances'.cyan,
	'  clouddatabase flavor list',
	'',

	'List Current Instances'.cyan,
	'  clouddatabase instance list',
	'',

	'Create New Instance'.cyan,
	'  clouddatabase instance create <instanceName> <flavorId/flavorRef> <dbSize> <databaseName>',
	'',

	'Create New Instance'.cyan,
	'  clouddatabase instance delete <instanceId>',
	'',

	'Resize Instance Disk Space'.cyan,
	'  clouddatabase instance resizeDisk <instanceId> <1-10>',
	'',

	'Resize Instance Flavor'.cyan,
	'  clouddatabase instance resizeFlavor <instanceName> <flavorId/flavorRef>',
	'',

	'List Databases'.cyan,
	'  clouddatabase instance listDatabases <instanceName>',
	'  clouddatabase instance addDatabase <instanceName> <databaseName>',
	'',

	'List Users'.cyan,
	'  clouddatabase instance listUsers <instanceName>',
	'  clouddatabase instance addUser <instanceName> <username> <database1> <database2> ...',
	'',

];