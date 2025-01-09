# MQTT-S7-Connector

![GitHub Release](https://img.shields.io/github/v/release/dixi83/mqtt-s7-connector)
![License](https://img.shields.io/github/license/dixi83/mqtt-s7-connector)

MQTT-S7-Connector connects a Siemens S7 PLC over MQTT with [Home Assistant](https://github.com/home-assistant/home-assistant)

This project is intended to use it along with [Home Assistant](https://github.com/home-assistant/home-assistant), but is also possible to use it as a simple bridge 
between a S7 PLC and a MQTT broker.

⚠️ **This project is still in an early stage of development and relies on your support.**

## Features

* Optimized PLC DB reads using [NodeS7](https://github.com/plcpeople/nodes7)
* Publishing PLC values to MQTT
* Writing MQTT values back to PLC-DBs
* Generate and publish Home Assistant discovery messages for devices/entities.

## Installation

This is just a plain Node.js App and should run with the latest LTS version of Node.js so you can invoke
```shell
npm ci
node index.js
```
to run the app.

### Home Assistant Addon

The MQTT-S7-Connector is available as native Home Assistant Addon: https://github.com/dixi83/hassio-addons/tree/main/mqtt-s7-connector

### Docker

There are docker-builds of the MQTT-S7-Connector published to [ghcr](https://github.com/dixi83/mqtt-s7-connector/pkgs/container/mqtt-s7-connector).

```shell
docker run -d -v $PWD/config.yaml:/app/config.yaml ghcr.io/dixi83/mqtt-s7-connector --loglevel 2
```

Note: You only have to mount the configuration file, not the entire folder.

Or use `docker-compose.yaml`:
```yaml
  mqtt-s7-connector:
    image: ghcr.io/dixi83/mqtt-s7-connector
    container_name: mqtt-s7-connector
    command: [ "--loglevel", "2" ]
    volumes:
      - ./config.yaml:/app/config.yaml
    restart: unless-stopped
```


## Configuration

### CLI-Arguments

| Option            | Shorthand | Description                                                                                            |
|--------------------|-----------|--------------------------------------------------------------------------------------------------------|
| `--config`        | `-c`      | Overwrite the default `config.yaml` file location.                                                    |
| `--addonversion`  | `-v`      | Set the version for the "origin" section of the discovery topic.                                       |
| `--loglevel`      | `-l`      | Sets the log level (0: Trace, 1: Debug, 2: Info, 3: Notice, 4: Warning (default), 5: Error, 6: Fatal). |

### Config-File

Most of the configurations are done using a config file. See [Configuration file documentation](./docs/config.md) for detailed instructions.

Implemented entity-types:

- [binarycover](./docs/binarycover.md)
- [climate](./docs/climate.md)
- [cover](./docs/cover.md)
- [heater](./docs/heater.md)
- [light](./docs/light.md)
- [number](./docs/number.md)
- [sensor](./docs/sensor.md)
- [switch](./docs/switch.md)


## Credits
* **[Tim Römisch](https://github.com/timroemisch/mqtt-s7-connector) who created MQTT-S7-Connection initially, this is just a fork!**
* [plcpeople / nodeS7](https://github.com/plcpeople/nodeS7)


## License

[Licensed under ISC](./LICENSE)
