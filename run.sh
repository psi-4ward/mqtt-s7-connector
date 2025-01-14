#!/usr/bin/env sh

# If the first argument is not an option, assume that we want to run the specified command
[ "${1#-}" = "$1" ] && exec "$@"


# Otherwise, run the node app and pass all arguments
exec node index.js $@
