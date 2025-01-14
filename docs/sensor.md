# Sensor device

The `sensor` type exposes an entity of the [Home Assistant Sensor Platform](https://www.home-assistant.io/integrations/sensor.mqtt/).

## Options

* *`name`: The name of the entity.
* *`state`: The `PLCconf` string or object used to read the value from the PLC.
* `device_class`: The [device-class](https://www.home-assistant.io/integrations/sensor#device-class) used by the Sensor-Platform.
* `value_template`: A template to transform the PLC value.
* `unit_of_measurement`: An optional unit.

## Examples

```yaml
  - device_name: Multi-Sensor 1
    name: Temperature
    manufacturer: Sensirion SHT41
    type: sensor
    state: DB1,REAL0
    unit_of_measurement: "°C"
    device_class: temperature

  - device_name: Multi-Sensor 1
    name: Humidity
    type: sensor
    state: DB1,REAL3
    unit_of_measurement: "%"
    device_class: humidity
```
