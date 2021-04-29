const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = (Model) => {
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = (await Model.findOne({ username })) || {};
        bcrypt.compare(password, user.password, (err, res) => {
          if (!res || err) {
            return done(null, false, { message: 'Incorrect login or password!' });
          }
          done(null, user);
        });
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    Model.findById(id, (err, user) => {
      done(err, user);
    });
  });
}