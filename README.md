# mqtt-s7-connector
This is a [Node.js](http://nodejs.org/) tool to connect a Siemens S7 PLC over Mqtt with [Home Assistant](https://github.com/home-assistant/home-assistant)

This project is intended to use it along with [Home Assistant](https://github.com/home-assistant/home-assistant), but is also possible to use it as a simple bridge 
between s7 and mqtt.


## Purpose
This tool can receive data over mqtt and can write it to a designated address on a plc and vice versa, enabling smart 
home data to be displayed in the home assistant.


## How to install

```
docker run -d -v /path/on/host/config.json:/usr/src/app/config.json timroemisch/mqtt-s7-connector
```
Note: You only have to mount the configuration file, not the entire folder.  
Config volume mountpoint: ```/usr/src/app/config.json```

Or run it directly from your console. Note that Node.js and NPM need to be installed. Run the following commands inside 
the mqtt-s7-connector folder to start mqtt-s7-connector
```shell
npm install --only=production
npm start
```

## Commandline options
`--yaml`<br>
Adding this option will enable mqtt-s7-connector to use YAML config files.

`--config <path>` <br>
Specify the path of the config file

## Auto Discovery
This tool will send for each device an auto-discovery message over mqtt in the correct format defined by Home Assistant.  

The default mqtt topic is ```homeassistant```, it can be changed in the config file. (See the [example](https://github.com/timroemisch/mqtt-s7-connector/blob/master/config.example.json#L10))


## ToDo
* climate component additional attributes
* code cleanup
* documentation + JSDoc comments
* more testing

Pull requests welcome! 😄


## Credits
* [plcpeople / nodeS7](https://github.com/plcpeople/nodeS7)
* [mqttjs / MQTT.js](https://github.com/mqttjs/MQTT.js)


## License

[Licensed under ISC](https://github.com/timroemisch/mqtt-s7-connector/blob/master/LICENSE)  
Copyright (c) 2021 Tim Römisch
