const addRepository = require('./addRepository');

test('it adds to top of repository list', () => {
  const json = {
    repositories: [
      {
        url: 'git@github.com:silverorange/swat.git',
        type: 'vcs'
      }
    ]
  };

  addRepository(json, 'git@github.com:silverorange/store.git');

  expect(json).toEqual({
    repositories: [
      {
        url: 'git@github.com:silverorange/store.git',
        type: 'vcs'
      },
      {
        url: 'git@github.com:silverorange/swat.git',
        type: 'vcs'
      }
    ]
  });
});

test('it adds to empty list', () => {
  const json = {
    repositories: []
  };

  addRepository(json, 'git@github.com:silverorange/store.git');

  expect(json).toEqual({
    repositories: [
      {
        url: 'git@github.com:silverorange/store.git',
        type: 'vcs'
      }
    ]
  });
});

test('it adds to missing list', () => {
  const json = {};

  addRepository(json, 'git@github.com:silverorange/store.git');

  expect(json).toEqual({
    repositories: [
      {
        url: 'git@github.com:silverorange/store.git',
        type: 'vcs'
      }
    ]
  });
});

test('it does not add duplicates', () => {
  const json = {
    repositories: [
      {
        url: 'git@github.com:silverorange/swat.git',
        type: 'vcs'
      }
    ]
  };

  addRepository(json, 'git@github.com:silverorange/swat.git');

  expect(json).toEqual({
    repositories: [
      {
        url: 'git@github.com:silverorange/swat.git',
        type: 'vcs'
      }
    ]
  });
});
