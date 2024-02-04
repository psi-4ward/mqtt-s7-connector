let commander;
let fs;
let yaml;
commander = require('commander');
fs = require('fs');
yaml = require('yaml');

let config = function() {
    // add --config option to specify config file path
    // add --yaml option to enable yaml config files
    commander
        .name('mqtt-s7-connector')
        .option('-c, --config <value>', 'Overwrite the default config file location. e.g. /etc/mqtt-s7-connector/config.json')
        .option('-y, --yaml', 'Takes yaml file as config file')
        .parse(process.argv);

// if --config argument is not specified use the config file as originally build
    if (commander.opts().config !== undefined) {
        if (commander.opts().yaml !== undefined) {
            return yaml.parse(fs.readFileSync(commander.opts().config, "utf8"));
        } else {
            return require(commander.opts().config);
        }
    } else {
        if (commander.opts().yaml !== undefined) {
            return yaml.parse('./config.yaml');
        } else {
            return require('./config');
        }
    }
}

module.exports = {
    config: config
}