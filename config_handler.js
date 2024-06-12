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
        .option('-l, --loglevel <value>', 'Sets the log level, Default=4 >>> 0: Trace, 1: Debug, 2: Info, 3: Notice, 4: Warning, 5: Error, 6: Fatal')
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

    if (commander.opts().loglevel !== undefined) {
        global.log_level = commander.opts().loglevel;
    } else {
        global.log_level = 4;
    }

}

module.exports = {
    config: config
}