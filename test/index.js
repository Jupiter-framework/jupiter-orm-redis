
import { expect, assert } from 'chai';
import { Promise } from 'es6-promise';
import { Fabric } from '../src/index';

const testFabric = Fabric({});
const testQuery = testFabric.query();

describe('Redis ORM', function() {
  it('Fabric API spec', function() {
    expect(testFabric).to.have.all.keys('query', 'connect', 'select', 'getConnection', 'close');

    [
      testFabric.query,
      testFabric.connect,
      testFabric.close,
      testFabric.select,
      testFabric.getConnection,
    ].forEach(function(func) {
      expect(func).to.be.ok.and.be.a('function');
    });
  });

  it('Query API spec', function() {
    expect(testQuery).to.have.all.keys('set', 'get', 'exec', 'clearQueue', 'getQueue');

    [
      testQuery.set,
      testQuery.get,
      testQuery.exec,
      testQuery.getQueue,
      testQuery.clearQueue,
    ].forEach(function(func) {
      expect(func).to.be.ok.and.be.a('function');
    });
  });

  it('Connection should be estabilished', function(done) {
    testFabric.connect();

    testFabric.getConnection().on('ready', function() {
      assert.ok(testFabric.getConnection().connected, 'connected client');
      testFabric.getConnection().end();
      done();
    });
  });

  it('exec() should return Promise', function() {
    const promise = testFabric.connect().select(1).query().get('test').exec();

    expect(promise.then).to.be.ok.and.to.be.a('function');
  });

  describe('Queue manipulation API', function() {
    it('get() and set() functions should add queries to the queue', function() {
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

      testQuery.set('key', 'value').get('key');

      expect(testQuery.getQueue()).to.be.ok.and.to.be.eql(expectedQueue);
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
        adapter.select(1),
      ].forEach(function(object) {
        expect(object).to.be.ok.and.to.be.eql(adapter);
      });
    });
  });

  after(function () {
    testFabric.getConnection().end();
  });
});
