const xmldom = require('xmldom');

const handlePossiblePluginError = require('./error-handlers/possible-plugin-error');
const handleNoPluginReturn = require('./error-handlers/no-plugin-return');
const handleBothApiUsage = require('./error-handlers/both-api-usage');

const domParser = new xmldom.DOMParser();
const xmlSerializer = new xmldom.XMLSerializer();

const DOM_API_KEY = 'overrideDOM';
const STRING_API_KEY = 'overrideText';

const getHtmlPlugins = require('./util/get-html-plugins');

const parseToDOM = (code) => domParser.parseFromString(code);
const parseToString = (dom) => xmlSerializer.serializeToString(dom);

/**
 * Execute middleware pattern on the initial file, put it through all the plugins
 * If some plugin is malformed or malfunctioning - the execution will be halted
 * This is defined in the correspoiding handlers
 * @param {string} templateFile
 */
module.exports = function middleware(templateFile) {
    const htmlPlugins = getHtmlPlugins();

    return Object.entries(htmlPlugins).reduce(
        (accDom, [name, pluginObjects]) => {
            // Generate the modified output
            const resultFromPlugin = pluginObjects.reduce((childAccDom, pluginObject) => {
                const {
                    [DOM_API_KEY]: overrideDOM,
                    [STRING_API_KEY]: overrideString
                } = pluginObject;

                // Prohibit attempting to use both DOM API and String API
                if (overrideDOM && overrideString) {
                    handleBothApiUsage(name);
                }

                // Handle String API usage
                if (overrideString) {
                    const domTextRepresentation = parseToString(childAccDom);
                    const overriddenTextRepresentation = handlePossiblePluginError(
                        () => overrideString({ markup: domTextRepresentation }),
                        name
                    );

                    return parseToDOM(overriddenTextRepresentation);
                }

                // Handle DOM API usage
                return handlePossiblePluginError(
                    () => overrideDOM({ dom: childAccDom, domParser }),
                    name
                );
            }, accDom);

            if (!resultFromPlugin) {
                handleNoPluginReturn(name);
            }

            return resultFromPlugin;
        },
        parseToDOM(templateFile)
    );
};
