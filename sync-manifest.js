const fs = require('fs');
const pkg = require('./package.json');
const manifest = require('./manifest.json');

manifest.version = pkg.version;

fs.writeFileSync('./manifest.json', JSON.stringify(manifest, null, 2));
console.log(`Manifest synced to v${pkg.version}`);
