const fs = require('fs');
const {join} = require('path');

const pathToOutputPackageJson = join(process.cwd(), '../coffee-app/package.json');
const pathToInputPackageJson = join(process.cwd(), './package.json');

const outputPackageContent = JSON.parse(fs.readFileSync(pathToOutputPackageJson, {encoding: 'utf-8'}));
const inputPackageContent = JSON.parse(fs.readFileSync(pathToInputPackageJson, {encoding: 'utf-8'}));

// update
outputPackageContent.version = inputPackageContent.version;
outputPackageContent.dependencies = inputPackageContent.dependencies;

// write

fs.writeFileSync(pathToOutputPackageJson, JSON.stringify(outputPackageContent, null, 2));