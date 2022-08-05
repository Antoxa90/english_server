const { exec } = require('child_process');

conn = new Mongo("mongodb://localhost:27017");
db = conn.getDB("englishdb");
db.createCollection("users");
db.users.updateOne({ 
  username: "admin" 
  }, {
    $setOnInsert: { username: "admin", password: "$2b$10$DqldnJyXJeF2dB9rVqCFUuaRhoZIekY9ENLQyl6r.6rtTC1vAc7Z.", role: "admin", packs: [] }
  },
  { upsert: true }
);

exec('mongoimport --uri="mongodb://localhost:27017/englishdb" --collection=verbs --file=verbs.json --jsonArray');
exec('mongoimport --uri="mongodb://localhost:27017/englishdb" --collection=words --file=dump.json --jsonArray');