const fs = require('fs');

module.exports = function isRequired(repoName) {
  fs.readFile('composer.lock', 'utf8', (err, contents) => {
    if (err) {
      console.log('composer.lock could not be read');
      process.exit(1);
    } else {
      try {
        const composerLock = JSON.parse(contents);
        const isRequiredPackage = composerLock.packages
          .some(thePackage => (thePackage.name === `silverorange/${repoName}`));

        console.log(isRequiredPackage);
      } catch (e) {
        console.log(`There was a syntax error in the composer.lock file ${e.message}`);
        process.exit(1);
      }
    }
  });
};
