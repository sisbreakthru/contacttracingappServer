const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const authenticate = require('./authenticate');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const eventRouter = require('./routes/eventRouter');
//const contactlistNameRouter = require('./routes/contactlistNameRouter');
//const contactlistLocRouter = require('./routes/contactlistLocRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/contacttracing';
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), 
  err => console.log(err)
);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,  // when a new session is created with no updates will not be saved
  resave: false, // will continue to resave session so it will continue to be marked active
  store: new FileStore()
}));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,  // when a new session is created with no updates will not be saved
  resave: false, // will continue to resave session so it will continue to be marked active
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Users must authenticate before accessing data from server
function auth(req, res, next) {
  console.log(req.user);
  
  if (!req.user) {
    const err = new Error('You are not authenticated!');
    err.status = 401; //std error code when credentials not yet provided
    return next(err); // send to express error handler
  } else {
    return next();  // pass the client to the next middleware
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/events', eventRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
