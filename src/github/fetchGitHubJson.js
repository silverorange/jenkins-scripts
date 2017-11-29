require('isomorphic-fetch');

const USER_AGENT = 'silverorange CI process';

module.exports = function fetchGitHubJson(url, authToken) {
  // eslint-disable-next-line no-undef
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'User-Agent': USER_AGENT
    }
  }).then(response => response.json());
};
