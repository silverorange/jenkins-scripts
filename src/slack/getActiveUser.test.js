/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */

jest.mock('slack');

test('matches userName', () => {
  const mockSlack = require('slack');
  mockSlack.__clearResponses();
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

  process.env.SLACK_BOT_TOKEN = 'xoxa-xxxxxxxxx-xxxx';
  const getActiveUser = require('./getActiveUser');

  expect.assertions(1);
  getActiveUser({
    displayName: 'Glinda P. Southgood',
    userName: 'glinda'
  }).then(user => {
    expect(user).toEqual({
      id: 'W07QCRPA4',
      team_id: 'T0G9PQBBK',
      name: 'glinda',
      deleted: false,
      color: '9f69e7',
      real_name: 'Glinda Southgood'
    });
  });
});

test('matches displayName', () => {
  const mockSlack = require('slack');
  mockSlack.__clearResponses();
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

  process.env.SLACK_BOT_TOKEN = 'xoxa-xxxxxxxxx-xxxx';
  const getActiveUser = require('./getActiveUser');

  expect.assertions(1);
  getActiveUser({
    displayName: 'Glinda Southgood',
    userName: 'glinda123'
  }).then(user => {
    expect(user).toEqual({
      id: 'W07QCRPA4',
      team_id: 'T0G9PQBBK',
      name: 'glinda',
      deleted: false,
      color: '9f69e7',
      real_name: 'Glinda Southgood'
    });
  });
});

test('rejects on no match', () => {
  const mockSlack = require('slack');
  mockSlack.__clearResponses();
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

  process.env.SLACK_BOT_TOKEN = 'xoxa-xxxxxxxxx-xxxx';
  const getActiveUser = require('./getActiveUser');

  expect.assertions(1);
  expect(
    getActiveUser({
      displayName: 'Barry White',
      userName: 'bw'
    })
  ).rejects.toEqual(new Error('Unable to match GitHub user to Slack user'));
});
