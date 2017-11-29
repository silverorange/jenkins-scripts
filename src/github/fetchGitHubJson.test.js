require('isomorphic-fetch');
const fetchMock = require('fetch-mock');
const fetchGitHubJson = require('./fetchGitHubJson');

test('it returns a promise with json data', () => {
  fetchMock.once('https://api.github.com/repos/silverorange/swat', {
    id: 11500608,
    name: 'swat',
    full_name: 'silverorange/swat',
    html_url: 'https://github.com/silverorange/swat',
    description: 'Web Application Toolkit. Widgets and more.',
    fork: false,
    url: 'https://api.github.com/repos/silverorange/swat'
  });

  fetchGitHubJson('https://api.github.com/repos/silverorange/swat').then(
    json => {
      expect(json).toEqual({
        id: 11500608,
        name: 'swat',
        full_name: 'silverorange/swat',
        html_url: 'https://github.com/silverorange/swat',
        description: 'Web Application Toolkit. Widgets and more.',
        fork: false,
        url: 'https://api.github.com/repos/silverorange/swat'
      });
    }
  );
});
