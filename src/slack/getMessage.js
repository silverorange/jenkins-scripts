module.exports = function getMessage(channelId, buildInformation) {
  return {
    channel: channelId,
    text: `Your PR _${buildInformation.prName}_ in _${
      buildInformation.repoName
    }_ failed CI during the _${buildInformation.stageName.toLowerCase()}_ stage. <${
      buildInformation.ciLink
    }|View in Jenkins>`
  };
};
