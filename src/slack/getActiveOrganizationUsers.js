const Slack = require('slack');

const bot = new Slack({ token: process.env.SLACK_BOT_TOKEN });

module.exports = function getActiveOrganizationUsers() {
  return bot.users
    .list({})
    .then(data => data.members.filter(user => !user.deleted));
};
