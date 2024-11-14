const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const Queue = require('bull');
const {Queue: QueueMQ} = require('bullmq');
const {createBullBoard} = require('@bull-board/api');
const {BullAdapter} = require('@bull-board/api/bullAdapter');
const {BullMQAdapter} = require('@bull-board/api/bullMQAdapter');
const {ExpressAdapter} = require('@bull-board/express');

const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const {ensureLoggedIn} = require('connect-ensure-login');

const config = require('./config');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(
  new LocalStrategy(function (username, password, cb) {
    if (username === config.auth.username && password === config.auth.password) {
      return cb(null, {user: 'bull-board'});
    }
    return cb(null, false);
  })
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

const createQueue = (name) => new Queue(name, {redis: config.redis});
const createAdapter = (name) => new BullAdapter(createQueue(name), {allowRetries: true, readOnlyMode: true});

const createQueueMQ = (name) => new QueueMQ(name, {connection: config.redis});
const createAdapterMQ = (queue) => new BullMQAdapter(createQueueMQ(queue), {allowRetries: true, readOnlyMode: true});


const createQueues = () => {
  return [
    ...config.queueNames.map(createAdapter),
    ...config.queueMqNames.map(createAdapterMQ),
  ];
}

const run = async () => {


  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/ui');

  createBullBoard({
    queues: createQueues(),
    serverAdapter,
    options: {
      uiConfig: config.uiConfig
    }
  });


  const app = express();
  // Configure view engine to render EJS templates.
  app.set('views', __dirname + '/../views');
  app.set('view engine', 'ejs');

  app.use(session({secret: 'keyboard cat', saveUninitialized: true, resave: true}));
  app.use(bodyParser.urlencoded({extended: false}));

  // Initialize Passport and restore authentication state, if any, from the session.
  app.use(passport.initialize({}));
  app.use(passport.session({}));

  app.get('/ui/login', (req, res) => {
    res.render('login', {invalid: req.query.invalid === 'true'});
  });

  app.post(
    '/ui/login',
    passport.authenticate('local', {failureRedirect: '/ui/login?invalid=true'}),
    (req, res) => {
      res.redirect('/ui');
    }
  );

  if (config.auth.disable) {
    app.use('/ui', serverAdapter.getRouter());
  } else {
    app.use('/ui', ensureLoggedIn({redirectTo: '/ui/login'}), serverAdapter.getRouter());
  }

  app.use('/', (req, res) => {
    res.redirect('/ui');
  });

  app.listen(3000, () => {
    console.log('🚀 Running on 3000...');
    console.log('🚀 For the UI, open http://localhost:3000/ui');
  });
};

// eslint-disable-next-line no-console
run().catch((e) => console.error(e));
