const getRepoDetails = require('./getRepoDetails');

test('it gets all details', () => {
  const json = {
    url: 'git@github.com:silverorange/swat.git',
    html_url: 'https://github.com/silverorange/swat',
    head: {
      repo: {
        ssh_url: 'git@github.com:gauthierm/swat.git'
      },
      sha: '47f675314e3cb68f99f36708b539ac37903be8bc'
    },
    base: {
      repo: {
        full_name: 'silverorange/swat'
      }
    }
  };

  const details = getRepoDetails(json);

  expect(details).toEqual({
    url: 'git@github.com:silverorange/swat.git',
    htmlUrl: 'https://github.com/silverorange/swat',
    sshUrl: 'git@github.com:gauthierm/swat.git',
    fullName: 'silverorange/swat',
    headSha: '47f675314e3cb68f99f36708b539ac37903be8bc'
  });
});
