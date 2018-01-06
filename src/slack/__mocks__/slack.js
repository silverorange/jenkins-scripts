/* eslint-disable no-underscore-dangle */

let nextResponseEntity = {};

function Slack() {}

Slack.prototype.users = {
  list: function list() {
    return new Promise(resolve => {
      resolve(nextResponseEntity);
    });
  }
};

Slack.__setNextResponse = function __setNextResponse(entity) {
  nextResponseEntity = entity;
};

module.exports = Slack;
