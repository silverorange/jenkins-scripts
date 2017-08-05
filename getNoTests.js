module.exports = function getNoTests(body) {
  return /no\s+tests?|(don't|do\s+not)\s+run\s+tests?|🚫\s+tests?/gi.test(body);
};
