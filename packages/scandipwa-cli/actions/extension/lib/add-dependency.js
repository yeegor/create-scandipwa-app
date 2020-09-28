const path = require('path');
const getLatestVersion = require('@scandipwa/scandipwa-dev-utils/latest-version');
const writeJson = require('@scandipwa/scandipwa-dev-utils/write-json');

const addDependency = async (package, version, isDev) => {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = require(packagePath);
    const depKey = isDev ? 'devDependencies' : 'dependencies';

    // prefer latest version, if version is falsy
    const realVersion = version || await getLatestVersion(package);

    if (!packageJson[depKey]) {
        packageJson[depKey] = {};
    }

    packageJson[depKey][package] = realVersion;

    writeJson(
        packagePath,
        packageJson
    );
};

module.exports = addDependency;