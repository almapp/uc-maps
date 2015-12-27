'use strict';

const request = require('supertest');
const HttpStatus = require('http-status-codes');

const server = require('../app/app').server;

describe('loading express', function () {
  it('responds to /', done => {
    request(server).get('/').expect(HttpStatus.OK, done);
  });

  it('404 everything else', done => {
    request(server).get('/foo/bar').expect(HttpStatus.NOT_FOUND, done);
  });
});
