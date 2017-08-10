module.exports = function getDependencies(body) {
  const requiredLines = body.match(
    /\b(?:requires\s+|depends\s+(?:up)?on\s+).*/gi
  );

  if (!requiredLines) {
    return [];
  }

  return requiredLines.reduce((links, line) => {
    const gitHubLinks = line.match(/https?:\/\/github.com\/([A-Za-z0-9_-]+)\/[A-Za-z0-9_-]+\/pull\/\d*/g);

    if (!gitHubLinks) {
      return links;
    }

    const apiLinks = gitHubLinks.map((gitHubLink) => {
      const matches = gitHubLink.match(/https?:\/\/github.com\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)\/pull\/(\d*)/);
      return `https://api.github.com/repos/${matches[1]}/${matches[2]}/pulls/${matches[3]}`;
    });

    return links.concat(apiLinks);
  }, []);
};
