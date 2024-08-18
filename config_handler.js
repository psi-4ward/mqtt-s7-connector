// noinspection JSUnresolvedReference

let commander = require("commander");
let sf = require('./service_functions.js');
let fs = require('fs');
let yaml = require('yaml');


let config = function() {
    // add --config option to specify a config file path
    // add --version option to set the version for the "origin" section of the discovery topic
    // add --loglevel option to specify the log level
    commander.name('mqtt-s7-connector')
        .option('-c, --config <value>', 'Overwrite the default config file location. e.g. /etc/mqtt-s7-connector/config.json')
        .option('-v, --addonversion <value>', 'Set the version for the "origin" section of the discovery topic')
        .option('-l, --loglevel <value>', 'Sets the log level, Default=4 >>> 0: Trace, 1: Debug, 2: Info, 3: Notice, 4: Warning, 5: Error, 6: Fatal')
        .parse(process.argv);

    if (commander.opts().loglevel !== undefined) {
        global.log_level = commander.opts().loglevel;
    } else {
        global.log_level = 4;
    }
    console.log('## INIT   ## log level is set to: ' + global.log_level);

    if (commander.opts().addonversion !== undefined) {
        global.addon_version = commander.opts().addonversion;
    } else {
        global.addon_version = "unset";
    }

    // if --config argument is not specified use the config file as originally build
    if (commander.opts().config !== undefined) {
        let extension = commander.opts().config.slice(-4);

        if (extension === "yaml" || extension === ".yml") {
            if (fs.existsSync(commander.opts().config)) {
                return yaml.parse(fs.readFileSync(commander.opts().config, "utf8"));
            } else {
                sf.error("Config file '" + commander.opts().config + "' not found")
            }
        } else {
            return require(commander.opts().config);
        }
    } else {
        if (fs.existsSync('./config.json')) {
            return require('./config');
        } else if (fs.existsSync('./config.yaml')) {
            return yaml.parse(fs.readFileSync('./config.yaml', "utf8"));
        } else if (fs.existsSync('./config.yml')) {
            return yaml.parse(fs.readFileSync('./config.yml', "utf8"));
        } else {
            sf.error("No config file found...")
        }
    }
}

module.exports = {
    config: config
}