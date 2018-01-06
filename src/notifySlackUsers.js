const getActiveOrganizationUsers = require('./slack/getActiveOrganizationUsers');
const contactUser = require('./slack/contactUser');

module.exports = function notifySlackUser(user, buildInformation, callback) {
  getActiveOrganizationUsers().then(slackUsers => {
    const realNameMatch = slackUsers.filter(
      slackUser => user.displayName === slackUser.real_name
    );
    const userNameMatch = slackUsers.filter(
      slackUser => user.userName === slackUser.name
    );

    if (realNameMatch.length !== 0 || userNameMatch.length !== 0) {
      contactUser(
        realNameMatch.length > 0 ? realNameMatch[0] : userNameMatch[0],
        buildInformation
      )
        .then(result => callback(null, result))
        .catch(err => callback(err));
    } else {
      callback('Unable to match GitHub user to Slack user');
    }
  });
};
