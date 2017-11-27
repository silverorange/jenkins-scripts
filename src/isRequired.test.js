/* eslint-env jest */
/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */

const fs = jest.mock('fs');

beforeEach(() => {
  require('fs').__clearMockFiles();
});

test('is required', () => {
  require('fs').__setMockFile('composer.lock', '{"packages":[{"name":"silverorange/swat"},{"name":"silverorange/store"}]}');
  const isRequired = require('./isRequired');
  isRequired('silverorange/swat', (err, result) => {
    expect(err).toBe(null);
    expect(result).toBe(true);
  });
});

test('invalid JSON', () => {
  require('fs').__setMockFile('composer.lock', '"packages":[{"name":"silverorange/swat"},{"name":"silverorange/store"}]}');
  const isRequired = require('./isRequired');
  isRequired('silverorange/swat', (err, result) => {
    expect(result).toBe(undefined);
    expect(err).toBe('There was a syntax error in the composer.lock file Unexpected token : in JSON at position 10');
  });
});

test('missing or unreadable composer.lock', () => {
  require('fs').__setMockFile('composer.json', '{"packages":[{"name":"silverorange/swat"},{"name":"silverorange/store"}]}');
  const isRequired = require('./isRequired');
  isRequired('silverorange/swat', (err, result) => {
    expect(result).toBe(undefined);
    expect(err).toBe('composer.lock could not be read');
  });
});
