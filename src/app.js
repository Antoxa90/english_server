const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const port = require('./constants').SERVER_PORT;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '../../node_modules/'));
app.use(session({ secret: 'shmecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

require('./routes')(app);

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});