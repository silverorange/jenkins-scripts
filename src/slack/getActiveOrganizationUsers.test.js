/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */

jest.mock('slack');

test('ignores deleted users', () => {
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
  const getActiveOrganizationUsers = require('./getActiveOrganizationUsers');

  expect.assertions(1);
  getActiveOrganizationUsers().then(users => {
    expect(users).toEqual([
      {
        id: 'W07QCRPA4',
        team_id: 'T0G9PQBBK',
        name: 'glinda',
        deleted: false,
        color: '9f69e7',
        real_name: 'Glinda Southgood'
      }
    ]);
  });
});
