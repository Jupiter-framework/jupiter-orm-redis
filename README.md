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

### .connect()

Establish connection to DB. Returns adapter object.

**Example**
```javascript
const orm = Fabric({
    //options
});

orm.connect();
```

### .select(num)

Switches used database.By default uses DB number passed to options object. Returns adapter object.

**Arguments**
num - {string} - id number of DB;

**Example**
```javascript
const orm = Fabric({
    //options
});

orm.connect().select(1);
```

### .query()

Returns Query interface of adapter

**Example**
```javascript
const orm = Fabric({
    //options
});

orm.connect().select(1).query().set('key','value').get('key').set('key','value');
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

orm.connect().query().set('key','value').get('key').exec().catch(function(err){throw new Error(err);});
```
