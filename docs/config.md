# MQTT-S7-Connection Configuration

The configuration defines settings for integrating a PLC with an MQTT broker, including
device discovery for Home Assistant.

We've a JSON-Schema to validate the config, you may use it in your IDE to get hints and completion while you edit your config.

For a (probably incomplete) reference see [config.example.yaml](../config.example.yaml).


## Common properties

* `update_time`: Time for periodic updates in milliseconds (default 10s).
* `temperature_interval`: Time for periodic updates in milliseconds (default 3min).
* `mqtt_base`: The MQTT prefix for the base topic (default `s7`).
* `mqtt_device_name`: The MQTT suffix for the base topic (default `plc`). The default pattern for the root-topic is `${mqtt_base}_${mqtt_device_name}`.
* `retain_messages`: Whether MQTT should [retain the messages](https://www.hivemq.com/blog/mqtt-essentials-part-8-retained-messages/).
* `discovery_prefix`: The base topic where Home Assistant subscribes to for device-discovery messages. 
* `discovery_retain`: Whether MQTT should retain the discovery-messages.


## PLC config

Following properties are child-props of `plc`.

* `port`: The TCP Port where the PLC listens to.
* `host`: The hostname or IP-address of the PLC.
* `rack`: The rack number of the PLC in the hardware configuration. Commonly `0` for most setups, but this depends on the
  specific physical configuration.
* `slot`: The slot number of the CPU within the rack. For example, S7-300 PLCs often use `2` for the CPU slot, while
  S7-1200/1500 typically use `1`.
* `debug`: A boolean value (true/false) to enable or disable debugging output. If true, additional connection and
  communication logs are printed, useful for troubleshooting.

## MQTT config

* `host`: The URL or IP address of the MQTT broker to which the client will connect. This can include the protocol (
  e.g., mqtt://, mqtts://) and the port (e.g., mqtt://broker.example.com:1883). If you run MQTT-S7-Connector as Home-Assistant and also the MQTT-Broker Add-on like Mosquitto you can use the internal DNS-Name: `mqtt://core-mosquitto:1883`.
* `user`: The username to authenticate on the MQTT-Broker.
* `password`: The password associated with the user for authentication.
* `rejectUnauthorized`: A boolean value (true/false) used for secure connections (mqtts://). If set to true, the client
  rejects the server’s certificate if it is not authorized or valid (e.g., self-signed certificates). Setting it to
  false allows connections even with invalid certificates, which can be useful in development but is not recommended for
  production.


## Devices/Entities config

The `devices` section holds an array with all your Devices/Entities which are mapped between S7 and MQTT.

### PLC Access

In general, the PLC read/writes are done using the [NodeS7 library](https://github.com/plcpeople/nodes7) 
which supports a String-based pattern to reference the target item on the PLC: `<Area><DB number>,<Data type><Byte offset>`.

The config allows several properties to be configured as `PLCconf` such as `state`, `brightness`, `target_temperature` and others. 

**Areas:**
* `DB`: Data-Block
* `M`: Memory (this Area is currently in development **not** supported yet, see [#14](https://github.com/dixi83/mqtt-s7-connector/issues/14))

**Data types:**
* `X`: Access a single bit represented as Boolean
* `BYTE`: Access a byte, represented as Number (unsigned int)
* `INT`: Access 2 bytes, represented as Number (signed int)
* `REAL`: Access 8 bytes, represented as Number (float)

**Byte offset:** The (zero-based) offset where the Read of the value should start. 
You could also address a Bit in a Byte using the dot-notation like `X2.2`.

#### Examples

```yaml
# Simple PLCconf (string mode)
devices:
  - name: Lightswitch
    state: DB4,X1.3 # Read the Bit 3 in Byte 1 on DB4
  - name: Temp-Sensor
    state: DB51,REAL216 # Read the REAL starting at Byte 216 on DB51
  - name: Humidity
    state: DB3,INT6 # Read the INT starting at Byte 6
```

#### Advanced PLC config

The example above shows how to define a PLC access using the `state` property as _String_.
In some cases, you may need more control over the behavior, so there is also an object mode:

```yaml
# Advanced PLCconf (object mode)
devices:
  - name: Lightswitch
    # define plc access using the object-mode
    state: 
      plc: DB4,X1.3 # Read the Bit 3 in Byte 1 on DB4
      update_interval: 1000 # Read the value every 1s
      rw: r # read-only value
```

Following properties are available in the object-mode of `PLCconf`:

* `plc`: This is the same value as on the string-mode and is mandatory.
* `update_interval`: Define the interval in milliseconds where the value should be read / polled from the PLC.
* `set_plc`: Usually the value has one representation address in the PLC where the read and write operations happens. If you define a `set_plc` property, the attributes-value are read from `plc` but writes goes to `set_plc` address. The format is identical with the one of `plc` like `DB2,X3.2` for example.
* `write_back`: If you've defined a `set_plc` property you can set the `write_back` boolean to `true` to automatically write any changed values received from the `plc`-address back to the `set_plc`-address.
* `rw`: The `rw` property configures the read/write permissions to/from the PLC/MQTT. For example, if an attribute has the `rw: r` set, no published values to MQTT would be written to the PLC (Temperature Sensor).  
  |      | Read PLC | Write PLC | Subscribe MQTT | Publish MQTT |
  |------|----------|-----------|----------------|--------------|
  | `r`  | ✅       | ❌        | ❌             | ✅           |
  | `w`  | ❌       | ✅        | ✅             | ❌           |
  | `rw` | ✅       | ✅        | ✅             | ✅           |


### Home Assistant Device Discovery

The MQTT-S7-Connector generates and published special MQTT messages which are used by Home Assistant to discover
and understand the type, features and behaviors of a device / entity. 

Let's see an example first:

```yaml
devices:
  - device_name: Livingroom Sensor
    name: Temperatur
    manufacturer: Psi-Systems
    type: sensor
    state: 
      plc: DB4,INT48
      rw: r
    unit_of_measurement: "°C"
    device_class: temperature
    value_template: "{{ (value | float / 10) | round(2) }}"
```

The example above reads a two-byte Integer from `DB4` starting at Byte 48.
The value of this sensor has a precision of 0.1 °C but its datatype is `INT`, so the 
one who implemented the PLC code decided to use a factor of 10 to represent temperature values
which can be _corrected_ using a `value_template` which extracts / derives / converts the 
value from the PLC to the one which has the correct representation in Home Assistant.

See the [MQTT Discovery](https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery) documentation
of Home Assistant to get an understanding of how it works. The supported options depend on the
component-type in Home Assistant like `sensor`, `switch` or `light`.

The unique ID of an entity gets composed by MQTT-S7-Connector using the `device_name` and `name` property.
The example above would generate an entity with the ID `livingroom_sensor_temperature` but the readable 
name of the Entity is `Temperature`.

#### Device vs Entity

In Home Assistant, a concrete value is assigned to an Entity. So, for example `Living Room Temperature`
can have a value of `21`. That's it and is the most basic representation when you only define a
device with the mandatory properties like `name`, `type` and `state` (for i.e., sensor devices).

When you want to expose a _Device_ which could group multiple Entities, you can specify a `device_name`.
All Entities with the same `device_name` are grouped together and show up as single Device im Home Assistant.

**In MQTT-S7-Connector, a device is basically just an entity in Home Assistant until you add device configs.**

So if you only need an Entity which exposes a value, you can omit the `device_name` property but for something
like a multi-sensor it's more readable and clear to generate also a Device for it which groups your entities together.

#### Discovery options

Different Home Assistants have different options. Pls consult the Device-specific dokumentation 
and the Home Assistant manual. The MQTT-S7-Connector only implements a subset of all available 
options. If you miss anything, pls feel free and open an Issue where you describe your use-case.

**Common discovery options**:

* `device_class`: The device-class defines the _type_ of the entity within it's component domain. 
  For example, a sensor can be of class `temperature`, `humidity`, `motion` and so on. Setting the correct
  class improves the UX in Home Assistant.
* `unit_of_measurement`: Define the Unit of the value, ie `°C` for temperature and `%` for humidity.
* `value_template`: Using a `template` you can define a [Home Assistant Jinja](https://www.home-assistant.io/docs/configuration/templating/) template to transform data. The `value_template` is used to convert the value from the MQTT topic into the correct representation used in Home Assistant. For example, our _Livingroom Sensor_ outputs `212` which can be converted to `21.2°C` using a template.
* `command_template`: The command template is the counterpart to the value_template and converts the Home Assistant value back to the representation in the PLC. In our example we could use `{{ (value * 10) | int }}"` to convert a setPoint-temperature of 22.5°C back to `225` which is expected as value in the PLC.
* `manufacturer`: A string which defines the manufacturer and gets shown on the HA Device. Only available when `device_name` is defined. 


## Devices

- [binarycover](binarycover.md)
- [climate](climate.md)
- [cover](cover.md)
- [heater](heater.md)
- [light](light.md)
- [number](number.md)
- [sensor](sensor.md)
- [switch](switch.md)


## Validation / JSON-Schema

The config gets validated against a JSON-Schema when the MQTT-S7-Connector app starts.

You could also reference the [Schema-File](../config_schema.yaml) in your IDE (when it supports it) to have validation and type hints while you type using a comment like `# $schema: ./config_schema.yaml`. 

### Understanding errors

Currently, we use `ajv` to validate the config and the errors may be not very human-friendly.

Let's see an example:

```yaml
  - name: Temperature
    type: number
    state:
      plc: DB4,INT52
      fullyWrongStuffHere: "0"
```

```js
[
  {
    instancePath: '/devices/0/state',
    schemaPath: '#/properties/devices/items/allOf/1/then/properties/state/oneOf/0/type',
    keyword: 'type',
    params: {
      type: 'string'
    },
    message: 'must be string'
  },
  {
    instancePath: '/devices/0/state',
    schemaPath: '#/properties/devices/items/allOf/1/then/properties/state/oneOf/1/additionalProperties',
    keyword: 'additionalProperties',
    params: {
      additionalProperty: 'fullyWrongStuffHere'
    },
    message: 'must NOT have additional properties'
  }
]
```

The above error tells us that we've a problem in our `devices` section, more precises in the `0`th item (so the first one, cause zero-based).

* The `type` should be a `string`: So this is not entirely correct cause the `PLCconf` type could also be an object BUT ...
* The schema of `PLCconf` object mode defined is wrong: It has a property `fullyWrongStuffHere` which is not allowed here.

The first option of the Schema `string` does not match but the second one fails so this is why you may receive _falsy_ errors here.
You should look through all errors regarding an item. Reading the [Schema](../config_schema.yaml) may also help.
