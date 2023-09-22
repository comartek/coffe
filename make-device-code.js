const fs = require('fs');
const {join} = require('path');
const {nanoid} = require('nanoid');

const getDeviceCode = () => {

    const pathToConfigFile = join(process.cwd(), '.devicerc');
    // read from file
    if (fs.existsSync(pathToConfigFile)) {
        return fs.readFileSync(pathToConfigFile, "utf8");
    }


    // generate and save to file
    const newDeviceCode = nanoid(10);
    fs.writeFileSync(pathToConfigFile, newDeviceCode, {encoding: 'utf8'});

    return newDeviceCode;
}

module.exports = {
    getDeviceCode,
}