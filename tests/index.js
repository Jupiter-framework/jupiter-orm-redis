
import { expect, assert } from 'chai';
import { Promise } from 'es6-promise';

import { Fabric } from '../src/index';


describe('Redis ORM', function(){
  it('Fabric API spec', function() {
    let testSubject = Fabric({});

    expect(testSubject).to.have.all.keys('query', 'connect', 'select', 'getConnection');

    [
      testSubject.query,
      testSubject.connect,
      testSubject.select,
      testSubject.getConnection
    ].forEach(function(func) {
      expect(func).to.be.ok.and.be.a('function');
    });
  });

  it('Query API spec', function() {
    const query = Fabric({}).query();

    expect(query).to.have.all.keys('set', 'get', 'exec', 'clearQueue', 'getQueue');

    [
      query.set,
      query.get,
      query.exec,
      query.getQueue,
      query.clearQueue,
    ].forEach(function(func) {
      expect(func).to.be.ok.and.be.a('function');
    });
  });

  it('Connection should be estabilished', function(done) {
    const ORM = Fabric({
      port: 6379,
      host: 'localhost',
    });

    ORM.connect();

    ORM.getConnection().on('ready', function() {
      assert.ok(ORM.getConnection().connected, 'connected client');
      ORM.getConnection().end();
      done();
    });
  });
});
