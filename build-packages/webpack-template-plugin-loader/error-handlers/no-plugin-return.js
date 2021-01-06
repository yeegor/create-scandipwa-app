const logger = require('@scandipwa/scandipwa-dev-utils/logger');

/**
 * This is an error handler. It halts the further execution.
 * It should be called when the described error is arose
 * @param {string} name processable plugin's name
 */
module.exports = (name) => {
    logger.error(
        `The "${name}" template plugin is malfunctioning, its output is invalid.`,
        'It must have returned a non-empty string or a valid DOM as the new value of the template.'
    );

    process.exit(255);
};
