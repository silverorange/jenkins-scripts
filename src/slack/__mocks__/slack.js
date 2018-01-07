/* eslint-disable no-underscore-dangle */

const nextResponseEntity = [];

function Slack() {}

Slack.prototype.users = {
  list: function list() {
    return Promise.resolve(nextResponseEntity.pop());
  }
};

Slack.prototype.im = {
  open: function open() {
    return Promise.resolve(nextResponseEntity.pop());
  }
};

Slack.prototype.chat = {
  postMessage: function open() {
    return Promise.resolve(nextResponseEntity.pop());
  }
};

Slack.__setNextResponse = function __setNextResponse(entity) {
  nextResponseEntity.unshift(entity);
};

Slack.__clearResponses = function __clearResponses() {
  while (nextResponseEntity.length) {
    nextResponseEntity.pop();
  }
};

module.exports = Slack;
