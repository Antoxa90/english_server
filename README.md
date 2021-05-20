# Dump words collection from the mongodb

```
mongoexport --uri="mongodb://localhost:27018/englishdb" --collection=words --out=dump.json
```

# Start

1. Run docker container with mongodb
`docker run --name mongodb -p 127.0.0.1:27018:27017  mongo:4.2.7-bionic`
2. Use `dump.json` for populate `words` collection:
`mongoimport --uri="mongodb://localhost:27018/englishdb" --collection=words --file=dump.json`
3. Run `npm start`
