const Nodes7 = require('nodes7');
const fastq = require('fastq');

let connected = false;
const isConnected = function () {
	return connected;
};

const setup = function (config, initDevices) {
	// create plc Object
	const plc = new Nodes7({
		silent: !config.debug
	});

	const writeQueue = fastq(plc, function (args, callback) {
		const queueCallback = callback;
		const appCallback = args[2];

		callback = function (error) {
			queueCallback(error, null);
			appCallback(error);
		}

		args[2] = callback;

		plc.writeItems.apply(plc, args);
	}, 1);

	writeQueue.pause();

	// connect to plc
	plc.initiateConnection({
		port: config.port,
		host: config.host,
		rack: config.rack,
		slot: config.slot
	}, function (err) {
		if (err !== undefined) {
			console.log("We have an error. Maybe the PLC is not reachable.");
			console.log(err);
			process.exit();
		}

		console.log('PLC Connected');
		connected = true;

		writeQueue.resume();

		initDevices();
	});


	return {
		writeItems: function () {
			writeQueue.push(arguments);
		},
		addItems: function () {
			plc.addItems.apply(plc, arguments);
		},
		setTranslationCB: function () {
			plc.setTranslationCB.apply(plc, arguments);
		},
		readAllItems: function () {
			plc.readAllItems.apply(plc, arguments);
		},
	};
};

module.exports = {
	setup: setup,
  isConnected: isConnected
}
