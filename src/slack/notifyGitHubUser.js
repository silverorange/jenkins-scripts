const getActiveUser = require('./getActiveUser');
const contactUser = require('./contactUser');

module.exports = function notifySlackUser(
  gitHubUser,
  buildInformation,
  callback
) {
  getActiveUser(gitHubUser)
    .then(slackUser => contactUser(slackUser, buildInformation))
    .then(result => callback(null, result))
    .catch(err => callback(err));
};
