const fs = require('fs');
const request = require('request');
authToken = process.argv[2];
jobName = process.argv[3];
isPackage = (process.argv[4] === 'package');
composerJson = '';
composerLock = '';
requirementsToProcess = 0;
modifiedPackages = [];

fs.readFile('composer.json', 'utf8', (err, contents) => {
  if (err) {
    console.log('composer.json could not be read');
    process.exit(1);
  } else {
    try {
      // parse
      composerJson = JSON.parse(contents);
    } catch (e) {
      console.log(`There was a syntax error in the composer.json file ${e.message}`);
      process.exit(1);
    }
  }
});

fs.readFile('composer.lock', 'utf8', (err, contents) => {
  if (err) {
    console.log('composer.lock could not be read');
    process.exit(1);
  } else {
    try {
      composerLock = JSON.parse(contents);
    } catch (e) {
      console.log(`There was a syntax error in the composer.lock file ${e.message}`);
      process.exit(1);
    }
  }
});

request({
  url: `https://api.github.com/repos/${jobName}`,
  auth: {
    'user': 'sogitbot',
    'pass': authToken
  },
  headers: {
    'User-Agent': 'silverorange jenkins process'
  }
}, readBody);

function readBody(error, response, body)
{
  if (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
  try {
    let json = JSON.parse(body);
    noTests = json.body.match(
        /no tests|don't run  tests|do not run tests|🚫/gi
    )
    if (noTests) {
      console.log('Detected no tests keyword');
      process.exit(3);
    }
    requiredLine = json.body.match(
      /Requires.*\r|Depends (?:up)?on.*/gi
    );
    if (!('repositories' in composerJson)) {
      composerJson.repositories = [];
    }
    if (isPackage) {
      addRequirement(json);
    }
    if (requiredLine) {
      githubLinks = requiredLine[0].match(/github.com\/silverorange\/[^\/]*\/pull\/\d*/g);
      if (githubLinks) {
        requirementsToProcess = githubLinks.length;
        githubLinks.forEach(function (value) {
          // The first element in the array includes silverorange, second
          // just the package name (matched in parentheses)
          packageName = value.match(/silverorange\/([^\/]*)/)[1];
          pullNumber = value.match(/pull\/([^\/]*)/)[1];
          request({
            url: `https://api.github.com/repos/silverorange/${packageName}/pulls/${pullNumber}`,
            auth: {
              'user': 'sogitbot',
              'pass': authToken
            },
            headers: {
              'User-Agent': 'silverorange jenkins process'
            }
          }, processDependency);
        });
      }
    } else {
      // No need to wait for asynchronous api hits, just write now
      writeComposer();
    }
  } catch (e) {
    console.log(`There was an issue parsing a response from the github api ${e.message}`);
    process.exit(1);
  }
}

function processDependency(error, response, body)
{
  if (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
  try {
    json = JSON.parse(body);
    addRequirement(json);
    requirementsToProcess -= 1;
    if (requirementsToProcess === 0) {
      writeComposer();
    }
  } catch (e) {
    console.log(`There was an issue loading other composer requirements ${e.message}`);
    process.exit(1);
  }
}

function addRequirement(json)
{
  composerJson.repositories.push({
    'type': 'git',
    'url': json.head.repo.ssh_url
  });
  let previousVersion = '';
  for (var x = 0; x < composerLock.packages.length; x++) {
    if (composerLock.packages[x].name === json.base.repo.full_name) {
      previousVersion = composerLock.packages[x].version;
      break;
    }
  }
  modifiedPackages.push(json.base.repo.full_name);
  composerJson.require[json.base.repo.full_name] = `dev-master#${json.head.sha} as ${previousVersion}`;
}

function writeComposer()
{
  const newContents = JSON.stringify(composerJson, null, 2);
  fs.writeFile('composer.json', newContents, function(err) {
    if (err) {
      return console.log(err);
      process.exit(1);
    }
  });
  let packages = '';
  for (var x = 0; x < modifiedPackages.length; x++) {
    packages = packages + modifiedPackages[x] + ' ';
  }
  console.log(packages);
}
