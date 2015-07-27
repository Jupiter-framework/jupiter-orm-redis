# jupiter-orm-redis

## API

#### .Fabric(options);

Returns API object of adapter;

**Arguments**
options - {object} - object with connection settings as properties

Available options:
* hostname - {string} - host name without protocol, e.g. '127.0.0.1';
* port - {number} - port of host server to connect;
* password - {string} - password for DB authorization;
* database - {number} - number of Redis DB to query.

**Example**
```javascript

let adapter = Fabric({
    host : "127.0.0.1",
    port : 6379,
    password: 'password',
    database: 0
});
```

## Adapter API

### .query()

Returns Query interface of adapter

**Example**
```javascript
const orm = Fabric({
    //options
});

orm.query().set('key','value').get('key').set('key','value');
```

### .exec()

Executes queued queries and returns Promise object.

**Example**
```javascript
const orm = Fabric({
    //options
});

orm.query().set('key','value').get('key');
orm.exec().catch(function(err){throw new Error(err);});
```

## Query API

### .set(key, value)

Queues 'set' query for execution. Returns *this*.

**Arguments**
key - {string} - key for DB item;
value - {string} - value to store in DB identified by key.

**Example**
```javascript
const orm = Fabric({
    //options
});

orm.query().set('key','value').exec().catch(function(err){throw new Error(err);});
```

### .get(key)

Queues 'get' query. Returns *this*

**Arguments**
key - {string} - key for DB item to query;

**Example**
```javascript
const orm = Fabric({
    //options
});

orm.query().get('key').exec().catch(function(err){throw new Error(err);});
```

### .exec()

Executes queued queries and returns Promise object.

**Example**
```javascript
const orm = Fabric({
    //options
});

orm.query().set('key','value').get('key').exec().catch(function(err){throw new Error(err);});
```

