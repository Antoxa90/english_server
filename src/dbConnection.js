const mongoose = require('mongoose');
const { DB_URL } = require('./constants');

class DbConnection {
  constructor() {
    this.connect();
  }

  connect = () => {
    mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  addScheme = (scheme, table, options = {}) => {
    if (options.plugins && options.plugins.length > 0) {
      options.plugins.map((plugin) => scheme.plugin(plugin));
    }
    return mongoose.model(table, scheme);
  }

  disconnect = () => {
    mongoose.disconnect();
  }
}

module.exports = {
  connection: new DbConnection(),
};