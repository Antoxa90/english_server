# Start

1. Install mongodb locally
2. Run init script for mongodb (default credentials: admin admin);
```
mongosh < initDatabase.js
```
3. Run server 
```
npm install && npm start
```

## Dump the words collection from the mongodb

```
mongoexport --uri="mongodb://localhost:27017/englishdb" --collection=words --out=dump.json --jsonArray
```