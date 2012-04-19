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
  ''


];