# Rackspace Cloud Database Command Line Tool

Useful command line toolset for Rackspace Cloud Database

### Installing clouddatabase-cli

	npm install clouddatabase-cli -g


### Getting Started
Before we can use the toolset we need to add the config variables for the cloud account

	clouddatabase config set cloudUsername <username>
	clouddatabase config set cloudApiKey <apiKey>
	clouddatabase config set cloudAccountNumber <accountNumber>

### List Instance Flavors
Once the setup - we can list what flavors of instances are available.

	clouddatabase flavor list

### List Current Server Instances
We can also see what servers we current have + add delete new ones

	clouddatabase instance list
	info:   List All Current Instances
	info:   ID	Name	Status
	info:   08f2b5cb-8cac-42ab-95b0-645279f7882b	test	ACTIVE
	info:   ab861a5f-076b-4c7b-a667-cd0566da0248	test	ACTIVE
	info:   0da39332-8aab-4b5e-bba7-16fb86f78194	nodeTest	ACTIVE


### Help is available too

	clouddatabase
	help:   Cloud Database Command Line Tool
	help:
	help:   Usage:
	help:
	help:     clouddatabase <resource> <action> <param1> <param2> ...
	help:
	help:   Common Use:
	help:
	help:   Add Config Username
	help:     clouddatabase config set cloudUsername <username>
	help:
	help:   Add Config apiKey
	help:     clouddatabase config set cloudApiKey <apiKey>
	help:
	help:   Add Config AccountNumber
	help:     clouddatabase config set cloudAccountNumber <accountNumber>
	help:
	help:   List Flavor Instances
	help:     clouddatabase flavor list
	help:
	help:   List Current Instances
	help:     clouddatabase instance list
	help:
	help:   Create New Instance
	help:     clouddatabase instance create <instanceName> <flavorId/flavorRef> <dbSize> <databaseName>
	help:
	help:   Create New Instance
	help:     clouddatabase instance delete <instanceId>
	help: