
import { Promise } from 'es6-promise';
import { createClient } from 'redis';
import { partialRight } from 'ramda';

function QueryFabric(connection) {
  const queue = [];
  const query = {};

  query.set = function(key, value) {
    addQuery(['set', key, value]);
    return this;
  };

  query.get = function(key) {
    addQuery(['get', key]);
    return this;
  };

  query.exec = function() {
    queue.reduce(function(sequence, queueItem) {
      sequence.then(function() {
        const method = queueItem[0];
        queueItem.shift();
        connection[method].apply(connection, queueItem);
      });
    }, Promise.resolve(null));
  };

  query.getQueue = function() {

  };

  query.clearQueue = function() {

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
      return QueryFabric(connection);
    },
  };

  return adapter;
}
