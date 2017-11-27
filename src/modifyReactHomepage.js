const fs = require('fs');

module.exports = function modifyHomepage(homepageURL) {
  fs.readFile('package.json', 'utf8', (err, contents) => {
    if (err) {
      console.log('error reading package.json');
      process.exit(1);
    } else {
      try {
        const packageJson = JSON.parse(contents);
        packageJson.homepage = homepageURL;
        const newPackage = `${JSON.stringify(packageJson, null, 2)}\n`;
        fs.writeFileSync('package.json', newPackage);
      } catch (e) {
        throw new Error('Error while modifying package.json');
      }
    }
  });
};
