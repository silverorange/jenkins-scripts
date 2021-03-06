const fs = require('fs');
const Promise = require('bluebird');
const chalk = require('chalk');
const getDependencies = require('./text/getDependencies');
const getNoTests = require('./text/getNoTests');
const addRepository = require('./composer/addRepository');
const addRequirement = require('./composer/addRequirement');
const getRepoDetails = require('./github/getRepoDetails');
const fetchGitHubJson = require('./github/fetchGitHubJson');

const readFileAsPromise = Promise.promisify(fs.readFile);
const writeFileAsPromise = Promise.promisify(fs.writeFile);

function writeComposerAsPromise(json, useTabs) {
  // Stringify JSON with pretty-printing and trailing newline.
  const newContents = `${JSON.stringify(json, null, 2)}\n`;

  // Convert spaces to tabs if needed.
  const formattedContents = useTabs
    ? newContents.replace(/^( {2})+/gm, fullMatch =>
        '\t'.repeat(fullMatch.length / 2)
      )
    : newContents;

  return writeFileAsPromise('composer.json', formattedContents);
}

// Store visited links to prevent infinite loop.
const visitedLinks = {};
function getDependenciesRecursive(url, authToken) {
  return fetchGitHubJson(url, authToken).then(json => {
    // Prevent infinite recursion. Mark link as visited.
    visitedLinks[url] = true;

    // Add this dependency to the list or returned dependencies.
    const dependencies = [getRepoDetails(json)];

    // Get sub-dependencies from JSON body field.
    const gitHubApiLinks = getDependencies(json.body);

    // Exclude sub-dependencies we've already visited.
    const linksToVisit = gitHubApiLinks.filter(subUrl => !visitedLinks[subUrl]);

    // Visit all sub-dependencies and merge returned array of dependencies.
    return Promise.all(
      linksToVisit.map(subUrl => getDependenciesRecursive(subUrl, authToken))
    ).then(subLinks =>
      subLinks.reduce(
        (allDependencies, subDependencies) =>
          allDependencies.concat(subDependencies),
        dependencies
      )
    );
  });
}

function getNoTestsForUrl(url, authToken) {
  return fetchGitHubJson(url, authToken).then(json =>
    Promise.resolve(getNoTests(json.body))
  );
}

module.exports = function modifyComposer(authToken, jobName, isPackage) {
  const jobUrl = `https://api.github.com/repos/${jobName}`;
  // Check if we should run CI tests for the job.
  getNoTestsForUrl(jobUrl, authToken).then(noTests => {
    if (noTests) {
      console.log(chalk.yellow('Detected no tests keyword'));
      process.exit(3);
    }

    // Load JSON files and all dependencies from GitHub PR bodies.
    Promise.props({
      composerJson: readFileAsPromise('composer.json', 'utf8'),
      lockJson: readFileAsPromise('composer.lock', 'utf8'),
      dependencies: getDependenciesRecursive(jobUrl, authToken)
    })
      .then(results => {
        const useTabs = /^\t/m.test(results.composerJson);
        let composerJson = '';
        let composerLock = '';

        try {
          // Check if file is indented with tabs or spaces. We could also use the
          // editorconfig file for this.
          composerJson = JSON.parse(results.composerJson);
        } catch (e) {
          throw new Error(
            `There is a syntax error in the composer.json file: ${e.message}.`
          );
        }

        try {
          composerLock = JSON.parse(results.lockJson);
        } catch (e) {
          throw new Error(
            `There is a syntax error in the composer.lock file: ${e.message}.`
          );
        }

        // Package PRs should update themselves (because they are included in
        // the composer.jsons of sites), but Site PRs shouldn't be included
        // (because they're never a composer dependency)
        const filteredDependencies = isPackage
          ? results.dependencies
          : results.dependencies.filter(
              dependency => !jobName.includes(dependency.fullName)
            );

        if (!('repositories' in composerJson)) {
          composerJson.repositories = [];
        }

        filteredDependencies.forEach(dependency => {
          addRepository(composerJson, dependency.sshUrl);
          addRequirement(composerJson, composerLock, dependency);
        });

        return writeComposerAsPromise(composerJson, useTabs).then(
          () => filteredDependencies
        );
      })
      .then(dependencies => {
        if (dependencies.length === 0) {
          console.log('No dependencies detected.');
        } else {
          console.log('Updated composer.json with the following dependencies:');
          dependencies.forEach(dependency => {
            console.log(` - ${dependency.fullName}`);
          });
        }
      })
      .catch(err => {
        console.error(chalk.red(`Error: ${err}`));
        process.exit(1);
      });
  });
};
