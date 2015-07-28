
import { expect, assert } from 'chai';
import { Promise } from 'es6-promise';
import { Fabric } from '../src/index';


describe('Redis ORM', function() {
  it('Fabric API spec', function() {
    const testSubject = Fabric({});

    expect(testSubject).to.have.all.keys('query', 'connect', 'select', 'getConnection');

    [
      testSubject.query,
      testSubject.connect,
      testSubject.select,
      testSubject.getConnection,
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

  it('exec() should return Promise', function() {
    const promise = Fabric({
      port: 6379,
      host: 'localhost',
    }).connect().select(1).query().get('test').exec();

    expect(promise.then).to.be.ok.and.to.be.a('function');
  });

  describe('Queue manipulation API', function() {
    it('get() and set() functions should add queries to the queue', function() {
      const query = Fabric({}).query();
      const expectedQueue = [
        [
          'set',
          'key',
          'value',
        ],
        [
          'get',
          'key',
        ],
      ];

      query.set('key', 'value').get('key');

      expect(query.getQueue()).to.be.ok.and.to.be.eql(expectedQueue);
    });

    it('clearQueue() should clear the contents of queue', function() {
      const query = Fabric({}).query();

      query.get('key');

      expect(query.getQueue()).to.be.ok.and.to.be.eql([['get', 'key']]);

      query.clearQueue();

      expect(query.getQueue()).to.be.ok.and.to.be.eql([]);
    });
  });

  describe('Chaining', function() {
    it('Query object\'s set() and get() functions should return this ', function() {
      const query = Fabric({}).query();

      [
        query.set(),
        query.get(),
      ].forEach(function(object) {
        expect(object).to.be.ok.and.to.be.eql(query);
      });
    });

    it('Adapter\'s functions connect() and select() should return adapter', function() {
      const adapter = Fabric({});

      [
        adapter.connect(),
        adapter.select(),
      ].forEach(function(object) {
        expect(object).to.be.ok.and.to.be.eql(adapter);
      });
    });
  });
});
