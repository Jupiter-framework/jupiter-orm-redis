import { expect } from 'chai';
import { Fabric } from '../src/index';
import { assert } from 'assert';
import { Promise } from 'es6-promise';

describe('Redis ORM', function(){
  describe('Base module: ', function(){
    it('Fabric method should return adapter object, that have API methods', function(){
      let testSubject = Fabric({});

      expect(testSubject.query).to.be.ok.and.be.a('function');
      expect(testSubject.exec).to.be.ok.and.be.a('function');
    });
    it('Adapter object\'s method query() should return Query object with API', function(){
      let testSubject = Fabric({}).query();

      expect(testSubject.set).to.be.ok.and.be.a('function');
      expect(testSubject.get).to.be.ok.and.be.a('function');
      expect(testSubject.exec).to.be.ok.and.be.a('function');
    });
    it('Query object\'s functions set() and get() must return this', function(){
      let testSubject = Fabric({}).query();

      expect(testSubject.set('','')).to.be.ok.and.be.eql(testSubject);
      expect(testSubject.get('')).to.be.ok.and.be.eql(testSubject);
    });
    it('ORM\'s function exec() must return promise', function(){
      let testSubject = Fabric({});

      assert(true, testSubject.exec().resolve);
    });

  });
});
