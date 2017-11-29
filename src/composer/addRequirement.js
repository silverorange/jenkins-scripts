module.exports = function addRequirement(json, lock, dependency) {
  const modifiedJson = json;

  const thePackage = lock.packages.find(
    element => element.name === dependency.fullName
  );
  const previousVersion = thePackage ? ` as ${thePackage.version}` : '';

  // TODO: check if it should be require or require-dev
  modifiedJson.require[dependency.fullName] = `dev-master#${
    dependency.headSha
  }${previousVersion}`;
};
