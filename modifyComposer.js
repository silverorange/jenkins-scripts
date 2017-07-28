const fs = require('fs');
const request = require('request');
authToken = process.argv[2];
jobName = process.argv[3];
isPackage = (process.argv[4] === 'package');
composerJson = '';
requirementsToProcess = 0;
modifiedPackages = [];

fs.readFile('composer.json', 'utf8', (err, contents) => {
  if (err) {
    console.log('File could not be read');
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
  let previousVersion = composerJson.require[json.base.repo.full_name].match(
    /\d*\.\d*\.\d*/g
  );
  modifiedPackages.push(json.base.repo.full_name);
  composerJson.require[json.base.repo.full_name] = `dev-master#${json.head.sha}`;
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
  for (individualPackage in modifiedPackages) {
    packages = packages + individualPackage + ' ';
  }
  console.log(packages);
}
