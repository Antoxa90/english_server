const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const usersSchema = new Schema({
  username: String,
  password: String,
  role: String,
  packs: [{
    name: String,
    data: [String]
  }]
});

const mapUsersModel = ({ id, username, role, packs }) => ({
  id,
  username,
  role,
  packs,
});

module.exports = {
  usersSchema,
  mapUsersModel,
};