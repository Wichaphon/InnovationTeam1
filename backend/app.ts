var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./lib/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var healthRouter = require('./routes/health');
var authRouter = require('./routes/auth');
var rbacRouter = require('./routes/rbac');
var setupRouter = require('./routes/setup');
var cors = require('cors');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/rbac', rbacRouter);
app.use('/api/setup', setupRouter);

module.exports = app;
