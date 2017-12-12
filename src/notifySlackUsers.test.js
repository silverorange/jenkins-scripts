/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */

test('cannot find user', () => {
  const notifySlackUser = require('./notifySlackUsers.js');
  notifySlackUser(
    {
      displayName: 'not a real user',
      userName: 'not a real user'
    },
    {},
    (err, result) => {
      expect(err).toBe('Unable to match GitHub user to Slack user');
      expect(result).toBe(undefined);
    }
  );
});

test('successful response', () => {
  const notifySlackUser = require('./notifySlackUsers.js');
  notifySlackUser(
    {
      displayName: 'slackbot',
      userName: 'slackbot'
    },
    {
      ciLink: 'https://www.example.com',
      prName: 'test',
      repoName: 'silverorange/test/PR-123',
      stageName: 'test'
    },
    (err, result) => {
      expect(err).toBe(null);
      expect(result).toBe('Success!');
    }
  );
});
