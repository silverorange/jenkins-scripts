function showModifyComposerHelp() {
  console.log('Usage:');
  console.log('  modify-composer <auth_token> <job_name> <package>');
  console.log();
  console.log('Arguments:');
  console.log(
    '  auth_token  a valid GitHub OAuth token used to get pull request dependencies.'
  );
  console.log(
    '  job_name    string containing organization name, repository name, and pull request number. For example silverorange/site/pulls/238.'
  );
  console.log(
    '  package     whether or not the pull request is for a package or a site.'
  );
  console.log();
}

function showSlackNotificationHelp() {
  console.log('Usage:');
  console.log(
    '  notify-slack-user <display_name> <user_name> <ci_url> <pr_name> <job_name> <stage_name>'
  );
  console.log();
  console.log('Arguments:');
  console.log(
    '  display_name  Real name of user initiating the build (CHANGE_AUTHOR_DISPLAY_NAME in Jenkins)'
  );
  console.log(
    '  user_name  GitHub username of user initiating the build (CHANGE_AUTHOR in Jenkins)'
  );
  console.log(
    '  ci_url  Link to a page that shows build failure details (RUN_DISPLAY_URL in Jenkins)'
  );
  console.log('  pr_name  Name of the PR on GitHub (CHANGE_TITLE in Jenkins)');
  console.log(
    '  job_name  Name of Job in form Organization/Repo/PR-123 (JOB_NAME in Jenkins)'
  );
  console.log(
    '  stage_name  Stage that the build failed during (STAGE_NAME in Jenkins) in Jenkins)'
  );
  console.log();
}

const helpMethods = {
  'modify-composer': showModifyComposerHelp,
  'notify-slack-user': showSlackNotificationHelp
};

module.exports = function showHelp(helpType) {
  helpMethods[helpType]();
};
