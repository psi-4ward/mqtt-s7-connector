let mqtt = require('mqtt');

let connected = false;
let isConnected = function () {
	return connected;
};

let setup = function (config, onMessage, finished) {

	// connect to mqtt
	let client = mqtt.connect(config["host"], {
		username: config["user"],
		password: config["password"],
		rejectUnauthorized: config["rejectUnauthorized"]
	});

	// successful connected :)
	client.on('connect', function () {
		console.log('MQTT Connected');
		connected = true;
		finished();
	});

	// handle incoming messages
	client.on('message', function (topic, msg) {
		onMessage(topic, msg.toString());
	});

	return client;
};

module.exports = {
	setup: setup,
	isConnected: isConnected
}
