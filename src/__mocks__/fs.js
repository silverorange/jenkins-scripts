/* eslint-disable no-underscore-dangle */

const fs = jest.genMockFromModule('fs');

let mockFiles = {};

function __setMockFile(name, content) {
  mockFiles[name] = content;
}

function __clearMockFiles() {
  mockFiles = {};
}

function readFile(filename, encoding, cb) {
  const content = mockFiles[filename] || null;
  if (content === null) {
    const err = new Error('File not found.');
    return cb(err);
  }
  return cb(null, content);
}

fs.__setMockFile = __setMockFile;
fs.__clearMockFiles = __clearMockFiles;
fs.readFile = readFile;

module.exports = fs;
