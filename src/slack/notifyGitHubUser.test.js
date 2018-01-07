/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */

test('cannot find user', () => {
  const mockSlack = require('slack');
  mockSlack.__clearResponses();

  // users list response
  mockSlack.__setNextResponse({
    members: [
      {
        id: 'W07QCRPA4',
        team_id: 'T0G9PQBBK',
        name: 'glinda',
        deleted: false,
        color: '9f69e7',
        real_name: 'Glinda Southgood'
      },
      {
        id: 'W012A3CDE',
        team_id: 'T012AB3C4',
        name: 'spengler',
        deleted: true,
        color: '9f69e7',
        real_name: 'spengler'
      }
    ]
  });

  // im channel open response
  mockSlack.__setNextResponse({
    ok: true,
    channel: {
      id: '#test'
    }
  });

  // chat postMessage response
  mockSlack.__setNextResponse({});

  const notifyGitHubUser = require('./notifyGitHubUser.js');

  notifyGitHubUser(
    {
      displayName: 'not a real user',
      userName: 'not a real user'
    },
    {},
    (err, result) => {
      expect(err).toEqual(
        new Error('Unable to match GitHub user to Slack user')
      );
      expect(result).toBe(undefined);
    }
  );
});

test('successful response', () => {
  const mockSlack = require('slack');
  mockSlack.__clearResponses();

  // users list response
  mockSlack.__setNextResponse({
    members: [
      {
        id: 'W07QCRPA4',
        team_id: 'T0G9PQBBK',
        name: 'glinda',
        deleted: false,
        color: '9f69e7',
        real_name: 'Glinda Southgood'
      },
      {
        id: 'W012A3CDE',
        team_id: 'T012AB3C4',
        name: 'spengler',
        deleted: true,
        color: '9f69e7',
        real_name: 'spengler'
      }
    ]
  });

  // im channel open response
  mockSlack.__setNextResponse({
    ok: true,
    channel: {
      id: '#test'
    }
  });

  // chat postMessage response
  mockSlack.__setNextResponse({});

  const notifyGitHubUser = require('./notifyGitHubUser.js');

  notifyGitHubUser(
    {
      displayName: 'glinda',
      userName: 'glinda'
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
