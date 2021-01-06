/* eslint-disable consistent-return */
const logger = require('@scandipwa/scandipwa-dev-utils/logger');

/**
 * This decorator function handles errors if any are thrown from the subject (cb).
 * The further execution is halted on error. The user is notified.
 *
 * @param {function} cb callback to attempt to execute
 * @param {string} name processable plugin's name
 * @returns {any} the result of the callback
 */
module.exports = (cb, name) => {
    if (!name) {
        throw new Error(
            'The plugin\'s name has not been provided to the possible error handler!'
        );
    }

    try {
        return cb();
    } catch (err) {
        logger.error(
            `The "${name}" template plugin is malfunctioning; it has thrown the following error:`,
            err.message
        );

        process.exit(255);
    }
};
