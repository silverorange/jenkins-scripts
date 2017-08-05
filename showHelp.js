module.exports = function showHelp() {
  console.log('Usage:');
  console.log('  node modifyComposer.js <auth_token> <job_name> <package>');
  console.log();
  console.log('Arguments:');
  console.log('  auth_token  a valid GitHub OAuth token used to get pull request dependencies.');
  console.log('  job_name    string containing repository name and pull request number. For example site/pulls/238.');
  console.log('  package     whether or not the pull request is for a package or a site.');
  console.log();
};
