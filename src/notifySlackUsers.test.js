const notifySlackUser = require('./notifySlackUsers.js');

test('cannot find user', () => {
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
