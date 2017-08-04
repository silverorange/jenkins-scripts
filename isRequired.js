repoName = process.argv[2]
const fs = require('fs');
fs.readFile('composer.lock', 'utf8', (err, contents) => {
  if (err) {
    console.log('composer.lock could not be read');
    process.exit(1);
  } else {
    try {
      composerLock = JSON.parse(contents);
      isRequiredPackage = false;
      for (var x = 0; x < composerLock.packages.length; x++) {
        if (composerLock.packages[x].name === `silverorange/${repoName}`) {
          isRequiredPackage = true;
          break
        }
      }
      console.log(isRequiredPackage);
    } catch (e) {
      console.log(`There was a syntax error in the composer.lock file ${e.message}`);
      process.exit(1);
    }
  }
});

