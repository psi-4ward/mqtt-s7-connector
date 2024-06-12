// Log levels:
// 0: Trace
// 1: Debug
// 2: Info
// 3: Notice
// 4: Warning
// 5: Error 	> Exit program
// 6: Fatal		> Exit program


module.exports.debug = function trace(msg) {
	if (global.log_level < 1) {
		console.log("## TRACE   ## " + msg);
	}
}

module.exports.debug = function debug(msg) {
	if (global.log_level <= 1) {
		console.log("## DEBUG   ## " + msg);
	}
}

module.exports.debug = function info(msg) {
	if (global.log_level <= 2) {
		console.log("## INFO    ## " + msg);
	}
}

module.exports.debug = function notice(msg) {
	if (global.log_level <= 3) {
		console.log("## NOTICE  ## " + msg);
	}
}

module.exports.warning = function warning(msg) {
	if (global.log_level <= 4) {
		console.log("## WARNING ## " + msg);
	}
}

module.exports.error = function error(msg) {
	if (global.log_level <= 5) {
		console.log("## ERROR  ## " + msg)
		throw new Error(msg);
	}
	process.exit(-1);
}

module.exports.error = function fatal(msg) {
	console.log("## FATAL  ## " + msg)
	throw new Error(msg);
}

module.exports.plc_response = function plc_response(err) {
	if (err) {
		console.log("Error while writing to PLC !");
	}
}
