module.exports = function addRepository(json, sshUrl) {
  // Make sure there is a repositories section.
  if (!json.repositories) {
    json.repositories = []; // eslint-disable-line no-param-reassign
  }

  // Make sure it's not already in the repository list.
  if (!json.repositories.some(repository => repository.url === sshUrl)) {
    // Add new repository to top of list so it overrides the default repository
    // list.
    json.repositories.unshift({
      type: 'vcs',
      url: sshUrl
    });
  }
};
