const Slack = require('slack');
const getMessage = require('./getMessage');

const bot = new Slack({ token: process.env.SLACK_BOT_TOKEN });

module.exports = function contactUser(user, buildInformation) {
  return new Promise((resolve, reject) => {
    bot.im.open({ user: user.id }).then(response => {
      if (!response.ok) {
        const err = new Error(
          `Error opening Slack message channel for ${user.real_name} (${
            user.id
          })`
        );
        err.response = response;
        reject(err);
      }

      bot.chat
        .postMessage(getMessage(response.channel.id, buildInformation))
        .then(() => resolve('Success!'))
        .catch(err => reject(err));
    });
  });
};
