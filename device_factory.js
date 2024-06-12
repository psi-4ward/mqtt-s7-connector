let sf = require('./service_functions.js');

let dev_light = require('./devices/light.js');
let dev_cover = require('./devices/cover.js');
let dev_sensor = require('./devices/sensor.js');
let dev_switch = require('./devices/switch.js');
let dev_climate = require('./devices/climate.js');
let dev_binCover = require('./devices/binaryCover.js');

module.exports = function deviceFactory(devices, plc, mqtt, config, mqtt_base) {
	let type = config.type.toLowerCase();

	// check name
	let name = config.name || "unnamed device";
	let mqtt_name;

	// if the attribute 'mqtt' isn't set
	// we have to generate one
	if (config.mqtt) {
		mqtt_name = config.mqtt;
	} else {
		mqtt_name = name.toLowerCase().split(' ').join('_').split('/').join('_').split('-').join('_');
	}

	// This below only generates a lot of entities every time the addon restarts....
	// it creates things like in the mqtt server:
	// "s7/test-light-dimable-1-1-1-1-1-1"
	// "s7/test-light-dimable-1-1-1-1-1-1-1"
	// "s7/test-light-dimable-1-1-1-1-1-1-1-1"
	// and like this in home assistant:
	// "light.test_light_dimable_1"
	// "light.test_light_dimable_2"
	// "light.test_light_dimable_10"
	// I decided to make a log.warning if a double name pops up
	//
	// TODO: remove this if test is successful
	// // check if the spot in the array is already occupied
	// // if it is then add a postfix to it
	// // loop so long until we found an empty spot
	// // let index = 1;
	// // let new_mqtt_name = mqtt_name;
	// // while (devices[new_mqtt_name] !== undefined) {
	// //	new_mqtt_name = mqtt_name + "_" + index;
	// //	index++;
	// // }

	let new_mqtt_name = mqtt_name;
	if (devices[new_mqtt_name] !== undefined) {
		sf.warning("Name: " + devices[new_mqtt_name] + " is used double! This can cause strange behaviour. Fix this in your config file!");
	}

	// save new values back to config,
	// so it can be processed in the new object
	config.name = name;
	config.mqtt = new_mqtt_name;
	config.mqtt_base = mqtt_base;

	switch (type) {
		case "light":
			return new dev_light(plc, mqtt, config);

		case "sensor":
			return new dev_sensor(plc, mqtt, config);

		case "switch":
			return new dev_switch(plc, mqtt, config);

		case "cover":
			return new dev_cover(plc, mqtt, config);

		case "climate":
			return new dev_climate(plc, mqtt, config);

		case "binarycover":
			return new dev_binCover(plc, mqtt, config);

		default:
			sf.debug("Unknown device type '" + type + "'");
	}


}
