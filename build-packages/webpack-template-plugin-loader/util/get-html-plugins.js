const path = require('path');
const extensions = require('@scandipwa/scandipwa-dev-utils/extensions');

/**
 * Collect all the default exports from the templatePlugins files
 */
module.exports = () => {
    extensions.reduce((acc, { packagePath }) => {
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

                // Handle CommonJS module
                return pluginModule;
            }
        );

        acc[name] = templatePlugins;
        return acc;
    }, {});
};
