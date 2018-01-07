const getActiveOrganizationUsers = require('./getActiveOrganizationUsers');

module.exports = function getActiveUser(user) {
  return new Promise((resolve, reject) => {
    getActiveOrganizationUsers().then(users => {
      const matches = users.filter(
        slackUser =>
          user.displayName === slackUser.real_name ||
          user.userName === slackUser.name
      );

      if (matches.length > 0) {
        resolve(matches[0]);
      } else {
        reject(new Error('Unable to match GitHub user to Slack user'));
      }
    });
  });
};
