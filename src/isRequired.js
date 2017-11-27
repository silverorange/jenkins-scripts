const fs = require('fs');

module.exports = function isRequired(repoName, cb) {
  fs.readFile('composer.lock', 'utf8', (err, contents) => {
    if (err) {
      cb('composer.lock could not be read');
    } else {
      try {
        const composerLock = JSON.parse(contents);
        const isRequiredPackage = composerLock.packages
          .some(thePackage => (thePackage.name === repoName));

        console.log(isRequiredPackage);
        cb(null, isRequiredPackage);
      } catch (e) {
        cb(`There was a syntax error in the composer.lock file ${e.message}`);
      }
    }
  });
};
