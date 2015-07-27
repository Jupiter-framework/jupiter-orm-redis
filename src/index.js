
import { Promise } from 'es6-promise';
import { createClient } from 'redis';
import { partialRight } from 'ramda';

export function Fabric(opts){
  let adapter = {};
  let query = {};

  let queryQueue = [];

  let addQuery = partialRight(function(query, queue){
    queue.push(query);
    return true;
  },getQueue());

  let clearQueue = function(){
    (function(queue){ queue.length = 0; })(getQueue());
    return true;
  }

  function getQueue(){
    return queryQueue;
  }

  let options = opts;

  let execute = function(){
    return new Promise(function(resolve, reject){
      let r = createClient(options.port, options.host, {});
      r.on('error', function(err){reject(err);});
      r.on('ready', function(){
        r.select(options.database);
        let resultSet = [];
        getQueue().map(function(queryElem){
          let args = queryElem.slice(1);
          if(queryElem[0] === 'set'){
            r.set(args[0], args[1], function(err, reply){
              resultSet.push(reply.toString());
            });
          }
          else if(queryElem[0] === 'get'){
            r.get(args[0], function(err, reply){
              resultSet.push(reply.toString());
            });
          }
          else {
            reject('Error: wrong query type');
          }
        });
        setTimeout(function(){
          resolve(resultSet);
          r.end();
        }, 50);
      });
    });
  };

  query.set = function(key, value){
    addQuery(['set', key, value]);
    return this;
  };

  query.get = function(key){
    addQuery(['get', key]);
    return this;
  };

  query.exec = execute;

  adapter.query = function(){
    return query;
  };

  adapter.exec = execute;

  return adapter;
}
