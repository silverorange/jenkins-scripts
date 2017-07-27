const fs = require('fs');
const request = require('request');
authToken = process.argv[2];
jobName = process.argv[3];
composerJson = '';
requirementsToProcess = 0;

console.log('Reading composer.json file');
fs.readFile('composer.json', 'utf8', (err, contents) => {
  if (err) {
    console.log('File could not be read');
  } else {
    try {
      // parse
      composerJson = JSON.parse(contents);
    } catch (e) {
      console.log(`There was a syntax error in the composer.json file ${e.message}`);
    }
  }
});

console.log('Querying Github API for PR body');
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
  }
  try {
    let json = JSON.parse(body);
    requiredLine = json.body.match(
      /Requires.*\r|Depends (?:up)?on.*/gi
    );
    if (requiredLine) {
      githubLinks = requiredLine[0].match(/github.com\/silverorange\/[^\/]*\/pull\/\d*/g);
      if (githubLinks) {
        console.log('Detected extra requirements');
        if (!('repositories' in composerJson)) {
          composerJson.repositories = [];
        }
        requirementsToProcess = githubLinks.length;
        githubLinks.forEach(function (value) {
          // The first element in the array includes silverorange, second
          // just the package name (matched in parentheses)
          packageName = value.match(/silverorange\/([^\/]*)/)[1];
          pullNumber = value.match(/pull\/([^\/]*)/)[1];
          console.log(`Adding ${packageName} PR #${pullNumber} to composer requirements`);
          composerJson.repositories.push({
            'type': 'git',
            'url': `git@github.com:${json.head.repo.owner.login}/${packageName}.git`
          });
          request({
            url: `https://api.github.com/repos/silverorange/${packageName}/pulls/${pullNumber}`,
            auth: {
              'user': 'sogitbot',
              'pass': authToken
            },
            headers: {
              'User-Agent': 'silverorange jenkins process'
            }
          }, addRequirements);
        });
      }
    }
  } catch (e) {
    console.log(`There was an issue parsing a response from the github api ${e.message}`);
  }
}

function addRequirements(error, response, body)
{
  if (error) {
    console.error(`Error: ${error}`);
  }
  try {
    json = JSON.parse(body);
    console.log(json.base.repo.name, json.head.sha);
    console.log(composerJson.require);
    composerJson.require[`silverorange/${json.base.repo.name}`] = `dev-master#${json.head.sha}`;
    requirementsToProcess -= 1;
    if (requirementsToProcess === 0) {
      writeComposer();
    }
  } catch (e) {
    console.log(`There was an issue loading other composer requirements ${e.message}`);
  }
}

function writeComposer()
{
  console.log('Writing new composer file');
  const newContents = JSON.stringify(composerJson, null, 2);
  fs.writeFile('composer.new.json', newContents, function(err) {
    if (err) {
      return console.log(err);
    }
  });
}
