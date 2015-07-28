
import { Promise } from 'es6-promise';
import { partialRight } from 'ramda';
import { createClient } from 'redis';

function queryFabric(connection) {
  const queue = [];
  const query = {};
  const resultSet = [];

  function getSet() {
    return resultSet;
  }

  function pushToSet(item) {
    getSet().push(item);
    return item;
  }

  const addQuery = partialRight(function(newQuery, queryQueue) {
    queryQueue.push(newQuery);
    return true;
  }, queue);

  query.set = function(key, value) {
    addQuery(['set', key, value]);
    return this;
  };

  query.get = function(key) {
    addQuery(['get', key]);
    return this;
  };

  query.exec = function() {
    return queue.reduce(function(sequence, queueItem) {
      return sequence.then(function() {
        return new Promise(function(resolve, reject) {
          const method = queueItem[0];
          queueItem.shift();
          queueItem.push(function(err, reply) {
            if (err) return reject(pushToSet(err));
            pushToSet(reply);
            resolve(getSet());
          })
          connection[method].apply(connection, queueItem);
        });

      });
    }, Promise.resolve(null));
  };

  query.getQueue = function() {
    return queue;
  };

  query.clearQueue = function() {
    this.getQueue().length = 0;
    return true;
  };

  return query;
}

export function Fabric(options) {
  let connection = null;

  function getPort(opts) {
    const optsPort = opts ? opts.port || options.port : options.port;

    return optsPort ? optsPort : 6379;
  }

  function getHost(opts) {
    const optsHost = opts ? opts.host || options.host : options.host;

    return optsHost ? optsHost : 'localhost';
  }

  const adapter = {
    connect(opts) {
      connection = createClient(getPort(opts), getHost(opts), {});

      return adapter;
    },
    getConnection() {
      return connection;
    },
    select(database) {
      connection.select(database || options.database);

      return adapter;
    },
    query() {
      return queryFabric(connection);
    },
  };

  return adapter;
}
