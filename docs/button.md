# Button device

The `button` type exposes a [mqtt-button](https://www.home-assistant.io/integrations/button.mqtt/) component.

If a `PRESS` event gets published the configured PLC-Bit gets set to `1` for a given time.

## Options

* *`name`: The name of the entity.
* *`state`: The `PLCconf`, must be an of type Bit (`X`).
* `device_name`: A optional device-name
* `press_duration`: The time in milliseconds the state-bit gets set to `1`, default `500`.
