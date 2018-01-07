const getMessage = require('./getMessage');

test('get message', () => {
  const buildInfo = {
    prName: 'PR-24',
    repoName: 'silverorange/test/PR-123',
    stageName: 'Lint',
    ciLink:
      'https://jenkins.silverorange.com/blue/organizations/jenkins/silverorange%2FSwat/detail/PR-24/4'
  };

  const message = getMessage('#test', buildInfo);
  expect(message).toEqual({
    channel: '#test',
    text:
      'Your PR _PR-24_ in _silverorange/test/PR-123_ failed CI during the _lint_ stage. <https://jenkins.silverorange.com/blue/organizations/jenkins/silverorange%2FSwat/detail/PR-24/4|View in Jenkins>'
  });
});
