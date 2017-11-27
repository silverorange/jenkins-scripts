/* eslint-env jest */

const getNoTests = require('./getNoTests');

describe('no tests', () => {
  test('no tests one space', () => {
    expect(getNoTests('no tests')).toBe(true);
  });

  test('no tests two spaces', () => {
    expect(getNoTests('no  tests')).toBe(true);
  });

  test('no tests tabs', () => {
    expect(getNoTests('no\ttests')).toBe(true);
  });

  test('uppercase no tests', () => {
    expect(getNoTests('No tests')).toBe(true);
  });

  test('no tests in sentence', () => {
    expect(getNoTests('please no tests for this PR')).toBe(true);
  });
});

describe('emoji', () => {
  test('emoji one space', () => {
    expect(getNoTests('🚫 tests')).toBe(true);
  });

  test('emoji two spaces', () => {
    expect(getNoTests('🚫  tests')).toBe(true);
  });

  test('emoji tabs', () => {
    expect(getNoTests('🚫\ttests')).toBe(true);
  });

  test('uppercase emoji ', () => {
    expect(getNoTests('🚫 Tests')).toBe(true);
  });

  test('emoji in sentence', () => {
    expect(getNoTests('please 🚫 tests for this PR')).toBe(true);
  });
});

describe('don\'t run tests', () => {
  test('don\'t run tests', () => {
    expect(getNoTests('don\'t run tests')).toBe(true);
  });

  test('don\'t run tests in sentence', () => {
    expect(getNoTests('pease don\'t run tests for this PR')).toBe(true);
  });

  test('uppercase don\'t run tests', () => {
    expect(getNoTests('Don\'t run tests.')).toBe(true);
  });
});

describe('do not run tests', () => {
  test('do not run tests', () => {
    expect(getNoTests('do not run tests')).toBe(true);
  });

  test('uppercase do not run tests', () => {
    expect(getNoTests('Do not run tests.')).toBe(true);
  });

  test('do not run tests in sentence', () => {
    expect(getNoTests('please do not run tests for this PR')).toBe(true);
  });
});

describe('ignore other phrases', () => {
  test('run tests', () => {
    expect(getNoTests('run tests')).toBe(false);
  });

  test('tests', () => {
    expect(getNoTests('tests')).toBe(false);
  });

  test('(blank)', () => {
    expect(getNoTests('')).toBe(false);
  });
});
