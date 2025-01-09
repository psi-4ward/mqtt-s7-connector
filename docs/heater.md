# Heater device

The heater device is a special implementation of a [`climate`-component](https://www.home-assistant.io/integrations/climate.mqtt/).

It sets the mode to `heat` or `off` depending on a threshold value and only supports `target_temperature` and `
current_temperature`.

PLC-Datatype support for `INT` and `REAL`.

## Options

* *`name`: The name of the entity.
* *`target_temperature`: `PLCconf` of the address with the target temperature.
* `current_temperature`: `PLCconf` of the address holding the current temperature. This value is read-only by default.
* `min_temp`: The minimal value which the Climate-Card should display.
* `max_temp`: The maximal value which the Climate-Card should display.
* `heatMode_temperature_threshold`: If the `target_temperature` is above this value, the `mode` should be set to `heat`, otherwise to `off`. For example, a target temperature of `4°C` should display as `off` in Home Assistant
* `value_template`: The Jinja template to transform the PCL value to Home Assistant. This template is used for `
  current_temperature` and `target_temperature` when defined.
* `current_temperature_template`: Template for the `current_temperature` value.
* `temperature_command_template`: Template for the `target_temperature` value.
* `temperature_command_template`: The Jinja template to transform the setPoint temperature from Home Assistant to the PLC value.

## Examples

```yaml
devices:
  - name: Bath heater
    type: heater
    target_temperature: DB4,REAL0
    heatMode_temperature_threshold: 4 # Everything <= 7°C should be understood as heater=off
    min_temp: 4
    max_temp: 30
    current_temperature: DB4,REAL5

  - name: Bedroom heater
    type: heater
    target_temperature:
      plc: DB4,INT48
      update_interval: 5000
    temperature_command_template: "{{ (value * 10) | int }}" # PLC expects temp*10 like 225 for 22.5°C
    value_template: "{{ (value | float / 10) | round(2) }}"  # PLC provides 212 for 21.2°C
    heatMode_temperature_threshold: 70 # Everything <= 7°C should be understood as heater=off
    min_temp: 7
    max_temp: 30
    current_temperature:
      plc: DB4,INT50
      update_interval: 1000 # Update the current temperature every 1s  - name: Bedroom heater
```
