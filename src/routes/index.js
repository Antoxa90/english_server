const UserController = require('../constrollers/UserController');
const WordController = require('../constrollers/WordController');

module.exports = app => {
  WordController(app);
  UserController(app);
};