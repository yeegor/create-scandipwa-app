const path = require('path');
const extensions = require('@scandipwa/scandipwa-dev-utils/extensions');
const logger = require('@scandipwa/scandipwa-dev-utils/logger');

const DOM_API_KEY = 'overrideDOM';
const STRING_API_KEY = 'overrideText';

// Collect all the default exports from the templatePlugins files
const getHtmlPluginFunctions = (extensions) => {
    extensions.reduce(
        (acc, { packagePath }) => {
            // Get template plugin paths from package.json
            const packageJsonPath = path.join(packagePath, 'package.json');
            const {
                name,
                scandipwa: {
                    build: {
                        templatePlugins: templatePluginPaths
                    } = {}
                } = {}
            } = require(packageJsonPath);

            // Handle no template plugins in the module
            if (!templatePluginPaths || !templatePluginPaths.length) {
                return acc;
            }

            // Handle template plugins exist
            const templatePlugins = templatePluginPaths.map(
                (filepath) => {
                    const pluginModule = require(filepath);

                    // Handle ES6 module
                    if (pluginModule.default) {
                        return pluginModule.default;
                    }

                    // Handle RequireJS module
                    return pluginModule;
                }
            );

            acc[name] = templatePlugins;
            return acc;
        },
        {}
    );
};

const parseToDOM = (code) => {
    // TODO parse to DOM
    console.log('Parsing code to DOM');

    return code;
};

const parseToString = (dom) => {
    // TODO parse to string
    console.log('Parsing DOM to code');

    return dom;
};

module.exports = function middleware(templateFile) {
    const htmlPlugins = getHtmlPluginFunctions(extensions);

    return Object.entries(htmlPlugins).reduce(
        (accDom, [name, pluginObjects]) => {
            // Generate the modified output
            const resultFromPlugin = pluginObjects.reduce((childAccDom, pluginObject) => {
                const {
                    [DOM_API_KEY]: overrideDOM,
                    [STRING_API_KEY]: overrideString
                } = pluginObject;

                if (overrideDOM && overrideString) {
                    logger.error(
                        `The ${name} template plugin is malformed.`,
                        'It interacts with template both as with DOM and as with text.',
                        'This is prohibited, please stick to one option when interacting with a template'
                    );

                    process.exit(255);
                }

                if (overrideString) {
                    return parseToDOM(overrideString(parseToString(childAccDom)));
                }

                return overrideDOM(childAccDom);
            }, accDom);

            // Handle invalid output
            if (!resultFromPlugin) {
                // Notify the user about invalid plugin
                logger.error(
                    `The "${name}" template plugin is malfunctioning, its output is invalid.`,
                    'It must have returned a non-empty string or a valid DOM as the new value of the template.'
                );

                // Break on first invalid output
                process.exit(255);
            }

            return resultFromPlugin;
        },
        parseToDOM(templateFile)
    );
};
