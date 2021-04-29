# Dump words collection from the mongodb

```
mongoexport --uri="mongodb://localhost:27018/englishdb" --collection=words --out=dump.json
```

# Start

1. Run docker container with mongodb
2. Use `dump.json` for populate `words` collection
3. Run `npm start`
