/* eslint-env jest */

const getDependencies = require('./getDependencies');

describe('single line', () => {
  test('parses single depends on', () => {
    const text = 'This PR depends on https://github.com/silverorange/swat/pull/20';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual(['https://api.github.com/repos/silverorange/swat/pulls/20']);
  });

  test('parses multiple depends on', () => {
    const text = 'This PR depends on https://github.com/silverorange/swat/pull/20 and https://github.com/silverorange/swat/pull/21';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual([
      'https://api.github.com/repos/silverorange/swat/pulls/20',
      'https://api.github.com/repos/silverorange/swat/pulls/21',
    ]);
  });

  test('parses single depends upon', () => {
    const text = 'This PR depends upon https://github.com/silverorange/swat/pull/20';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual(['https://api.github.com/repos/silverorange/swat/pulls/20']);
  });

  test('parses single requires', () => {
    const text = 'This PR requires https://github.com/silverorange/swat/pull/20';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual(['https://api.github.com/repos/silverorange/swat/pulls/20']);
  });
});

describe('HTTP vs HTTPS', () => {
  test('parses HTTP links', () => {
    const text = 'This PR depends on http://github.com/silverorange/swat/pull/20';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual(['https://api.github.com/repos/silverorange/swat/pulls/20']);
  });
});

test('does not parse depends without on', () => {
  const text = 'This PR depends https://github.com/silverorange/swat/pull/20';
  const dependencies = getDependencies(text);
  expect(dependencies).toEqual([]);
});

describe('repo special characters', () => {
  test('parses repos with dashes', () => {
    const text = 'This PR depends on http://github.com/silver-orange/swat-tests/pull/20';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual(['https://api.github.com/repos/silver-orange/swat-tests/pulls/20']);
  });

  test('parses repos with underscores', () => {
    const text = 'This PR depends on http://github.com/silver_orange/swat_tests/pull/20';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual(['https://api.github.com/repos/silver_orange/swat_tests/pulls/20']);
  });

  test('parses repos with numbers', () => {
    const text = 'This PR depends on http://github.com/silverorange/swat2/pull/20';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual(['https://api.github.com/repos/silverorange/swat2/pulls/20']);
  });
});

describe('multiple line parsing', () => {
  test('parses multiple lines', () => {
    const text = 'This PR depends on https://github.com/silverorange/swat/pull/20\n and depends on https://github.com/silverorange/swat/pull/21';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual([
      'https://api.github.com/repos/silverorange/swat/pulls/20',
      'https://api.github.com/repos/silverorange/swat/pulls/21',
    ]);
  });

  test('parses multiple lines with single depends', () => {
    const text = 'This PR depends on https://github.com/silverorange/swat/pull/20\n and https://github.com/silverorange/swat/pull/21';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual([
      'https://api.github.com/repos/silverorange/swat/pulls/20',
      'https://api.github.com/repos/silverorange/swat/pulls/21',
    ]);
  });

  test('parses multiple lines with single depends and stops at period', () => {
    const text = 'This PR depends on https://github.com/silverorange/swat/pull/20\n and https://github.com/silverorange/swat/pull/21. This is a second sentence with another link https://github.com/silverorange/swat/pull/22.';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual([
      'https://api.github.com/repos/silverorange/swat/pulls/20',
      'https://api.github.com/repos/silverorange/swat/pulls/21',
    ]);
  });

  test('parses multiple lines with single depends and stops at paragraph', () => {
    const text = 'This PR depends on https://github.com/silverorange/swat/pull/20\n and https://github.com/silverorange/swat/pull/21\n\nThis is a second paragraph with another link https://github.com/silverorange/swat/pull/21';
    const dependencies = getDependencies(text);
    expect(dependencies).toEqual([
      'https://api.github.com/repos/silverorange/swat/pulls/20',
      'https://api.github.com/repos/silverorange/swat/pulls/21',
    ]);
  });
});
