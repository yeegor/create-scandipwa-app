const prepareFileSystem = require('./lib/steps/prepare-fs');
const prepareOS = require('./lib/steps/prepare-os');
const deployServices = require('./lib/steps/deploy-services');
const getPorts = require('./lib/util/get-ports');
const { startPhpFpm } = require('./lib/steps/manage-php-fpm');

const start = async () => {
    // make sure deps are installed
    await prepareOS();

    const ports = await getPorts();

    // make sure cache folder with configs is present
    await prepareFileSystem(ports);

    await startPhpFpm();

    // startup docker services
    await deployServices(ports);

    // startup app
    // await deployMagento()
};

module.exports = start;
