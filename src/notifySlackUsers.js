const Slack = require('slack');
const Promise = require('bluebird');
const bot = new Slack({token: process.env.SLACK_BOT_TOKEN});

function getActiveOrganizationUsers() {
  return Promise.resolve(bot.users.list({}).then(data => {
    return data.members.filter(user => !user.deleted);
  }));
}

module.exports = function notifySlackUser(user, buildInformation, callback) {
  getActiveOrganizationUsers().then(slackUsers => {
    realNameMatch = slackUsers.filter(slackUser => user.displayName === slackUser.real_name);
    userNameMatch = slackUsers.filter(slackUser => user.userName === slackUser.name);

    if (realNameMatch.length === 0 && userNameMatch.length === 0) {
      console.log('Unable to match GitHub user to Slack user');
      process.exit(1);
    }

    userToContact = realNameMatch.length > 0 ? realNameMatch[0] : userNameMatch[0];
    bot.im.open({user: userToContact.id}).then(response => {
      if (!response.ok) {
        console.log(`Error opening Slack Message Channel with ${userToContact.real_name}`);
        console.log(response);
        process.exit(1);
      }

      bot.chat.postMessage({channel: response.channel.id, text: 'test'}, console.log);
    }).catch(err => {
      console.log(err);
      process.exit(1);
    })

  }).catch(err => {
    console.log(err);
    process.exit(1);
  });

}