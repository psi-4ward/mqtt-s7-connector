// Log levels:
// 0: Trace
// 1: Debug
// 2: Info
// 3: Notice
// 4: Warning
// 5: Error 	> Exit program
// 6: Fatal		> Exit program

function datetime() {
	let ts = Date.now();

	let date_time = new Date(ts);
	let date = date_time.getDate();
	let month = date_time.getMonth() + 1;
	let year = date_time.getFullYear();
	let hour = date_time.getHours();
	let minute = date_time.getMinutes();
	let second = date_time.getSeconds();

	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

const red = '\\x1b[31m ';
const green = '\\x1b[32m ';
const yellow = '\\x1b[33m ';
const blue = '\\x1b[34m ';
const cyan = '\\x1b[36m ';
const redBright = '\\x1b[39m ';
const blueBright = '\\x1b[42m ';
const reset = ' \\x1b[0m';

module.exports.trace = function trace(msg) {
	if (global.log_level < 1) {
		console.log(green, datetime() + " ## TRACE   ## " + msg, reset);
	}
}

module.exports.debug = function debug(msg) {
	if (global.log_level <= 1) {
		console.log(cyan, datetime() + " ## DEBUG   ## " + msg, reset);
	}
}

module.exports.info = function info(msg) {
	if (global.log_level <= 2) {
		console.log(blue, datetime() + " ## INFO    ## " + msg, reset);
	}
}

module.exports.notice = function notice(msg) {
	if (global.log_level <= 3) {
		console.log(blueBright, datetime() + " ## NOTICE  ## " + msg, reset);
	}
}

module.exports.warning = function warning(msg) {
	if (global.log_level <= 4) {
		console.log(yellow, datetime() + " ## WARNING ## " + msg, reset);
	}
}

module.exports.error = function error(msg) {
	if (global.log_level <= 5) {
		console.log(red, datetime() + " ## ERROR  ## " + msg, reset)
		throw new Error(msg);
	}
	process.exit(-1);
}

module.exports.fatal = function fatal(msg) {
	console.log(redBright, datetime() + " ## FATAL  ## " + msg, reset)
	throw new Error(msg);
}