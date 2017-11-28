module.exports = function getDependencies(body) {
  // Match key phrases:
  // - requires X
  // - depends on X
  // - depends upon X
  // followed by arbitrary content until the next period, the next double
  // newline or the end of the string.
  const requiredLines = body.match(
    /\b(requires\s+|depends\s+(up)?on\s+)(.|\n)+?(\.(\s|$)|\n\n|$)/gi
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
