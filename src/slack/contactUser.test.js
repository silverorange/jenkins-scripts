/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */

jest.mock('slack');

test('fails on bad response', () => {
  const mockSlack = require('slack');
  mockSlack.__clearResponses();
  mockSlack.__setNextResponse({
    ok: false,
    channel: {
      id: '#test'
    }
  });

  process.env.SLACK_BOT_TOKEN = 'xoxa-xxxxxxxxx-xxxx';
  const contactUser = require('./contactUser');

  const user = {
    id: 'W07QCRPA4',
    real_name: 'Glenda'
  };
  const buildInformation = {
    prName: '',
    repoName: '',
    stageName: '',
    ciLink: ''
  };

  expect.assertions(2);
  contactUser(user, buildInformation).catch(err => {
    expect(err.message).toEqual(
      'Error opening Slack message channel for Glenda (W07QCRPA4)'
    );
    expect(err.response).toEqual({
      ok: false,
      channel: {
        id: '#test'
      }
    });
  });
});

test('succeeds', () => {
  const mockSlack = require('slack');
  mockSlack.__clearResponses();

  // im channel open response
  mockSlack.__setNextResponse({
    ok: true,
    channel: {
      id: '#test'
    }
  });

  // chat postMessage response
  mockSlack.__setNextResponse({});

  process.env.SLACK_BOT_TOKEN = 'xoxa-xxxxxxxxx-xxxx';
  const contactUser = require('./contactUser');

  const user = {
    id: 'W07QCRPA4',
    real_name: 'Glenda'
  };
  const buildInformation = {
    prName: '',
    repoName: '',
    stageName: '',
    ciLink: ''
  };

  expect.assertions(1);
  contactUser(user, buildInformation).then(response => {
    expect(response).toEqual('Success!');
  });
});
