let Nodes7;
let fastq;
Nodes7 = require('nodes7');
fastq = require('fastq');

let connected = false;
let isConnected = function () {
	return connected;
};

let setup = function (config, callback) {
	// create plc Object
	let plc = new Nodes7({
		silent: !config.debug
	});

	let writeQueue = fastq(plc, function (args, callback) {
		let queueCallback = callback;
		let appCallback = args[2];

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

		callback();
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
