
const passport = require('passport');
const bcrypt = require('bcrypt');
const { connection } = require('../dbConnection');
const { usersSchema, mapUsersModel } = require('../models/UserSchema');
const AuthService = require('../services/AuthService');
const errorHandler = require('../utils/errorHandler');

const UsersModel = connection.addScheme(usersSchema, 'Users');

AuthService(UsersModel);

const getPasswordHash = (password) =>
  new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash)
    })
  );

module.exports = (app) => {
  // Authenticate user
  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json(info);
      }
      req.login(user, (loginError) => {
        if (loginError) {
          return next(loginError);
        }

        return res.status(200).json({ message: 'success', user: { username: user.username, role: user.role } });
      });
    })(req, res, next);
  });

  // Log out
  app.get('/api/logout', (req, res) => {
    passport.authenticate('local', { session: false });
    req.logout();
    res.send({ message: 'success' });
  });

  // Register a new user
  app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 400, message: 'Bad request' });
    }

    try {
      const data = await UsersModel.findOne({ username });
      if (data) {
        return res.status(400).json({ status: 400, message: 'User with this username already exists' });
      }

      const passwordHash = await getPasswordHash(password);
      const userData = await UsersModel.create({ username, password: passwordHash, role: 'user', packs: [] });
      console.log('created', userData);
      return res.status(200).json(mapUsersModel(userData));
    } catch (error) {
      errorHandler(`Can\'t create a user`, 'Error - post /api/signup');
    }
  });

  // Get user info
  app.get('/api/users/:username', async (req, res) => {
    const username = req.params.username;
    try {
      const data = await UsersModel.findOne({ username });
      return res.status(200).json(mapUsersModel(data));
    } catch (error) {
      errorHandler(`Can\'t get user with the username ${username})`, 'Error - get /api/users/:username');
    }
  });

  app.put('/api/users/:username', async (req, res) => {
    const username = req.params.username;
    const packs = req.body.packs;
    try {
      await UsersModel.updateOne({ username }, { packs });
      return res.status(200).json({ packs });
    } catch (error) {
      errorHandler(`Can\'t update user with the username ${username})`, 'Error - put /api/users/:username');
    }
  })

  // Check user authentication
  app.get('/api/is_auth', function (req, res) {
    if (req.isAuthenticated())
      return res.status(200).json({ message: 'authenticated', user: mapUsersModel(req.user), success: true });
    else
      return res.status(200).json({ message: 'Doesn\'t authenticated' });
  });
}