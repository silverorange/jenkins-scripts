module.exports = function getRepoDetails(json) {
  return {
    url: json.url,
    htmlUrl: json.html_url,
    sshUrl: json.head.repo.ssh_url,
    fullName: json.base.repo.full_name,
    headSha: json.head.sha
  };
};
