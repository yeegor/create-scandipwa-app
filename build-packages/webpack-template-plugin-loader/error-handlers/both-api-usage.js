const logger = require('@scandipwa/scandipwa-dev-utils/logger');

/**
 * This is an error handler. It halts the further execution.
 * It should be called when the described error is arose
 * @param {string} name processable plugin's name
 */
module.exports = (name) => {
    logger.error(
        `The ${name} template plugin is malformed.`,
        'It interacts with template both as with DOM and as with text.',
        'This is prohibited, please stick to one option when interacting with a template'
    );

    process.exit(255);
};
