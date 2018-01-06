/* eslint-disable no-underscore-dangle */

let nextResponseEntity = {};

function Slack() {}

Slack.prototype.users = {
  list: function list() {
    return Promise.resolve(nextResponseEntity);
  }
};

Slack.prototype.im = {
  open: function open() {
    return Promise.resolve(nextResponseEntity);
  }
};

Slack.prototype.chat = {
  postMessage: function open() {
    return Promise.resolve(nextResponseEntity);
  }
};

Slack.__setNextResponse = function __setNextResponse(entity) {
  nextResponseEntity = entity;
};

module.exports = Slack;
