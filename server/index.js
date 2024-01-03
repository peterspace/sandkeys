const dotenv = require('dotenv').config();
// require(dotenv).config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const userRoute = require('./routes/userRoute');
const paymentRoute = require('./routes/paymentRoute');
const contactRoute = require('./routes/contactRoute');
const { errorHandler } = require('./middleware/errorMiddleware.js');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');

//==========={using clodinary}===================

const { uploadImage } = require('./utils/uploadImage.js');

//=============={new Routes}==================================
const placeRoute = require('./routes/placeRoute');
const bookingRoute = require('./routes/bookingRoute');
const reservationRoute = require('./routes/reservationRoute');

//====================={AUTH}==============================
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
//====================={AUTH}==============================

const app = express();

const backendURL = process.env.BACKEND_URL;
const frontendURL = process.env.FRONTEND_URL;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5000',
      frontendURL,
      backendURL,
    ],
    credentials: true,
  })
);


// -momery unleaked---------
app.set('trust proxy', 1);
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

let userInfo;

const loginGoogle = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${backendURL}/auth/google/callback`,
      // callbackURL: 'http://localhost:4000/auth/google/callback',
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      userInfo = profile;
      return done(null, profile);
    }
  )
);

const loginFacebook = passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      // callbackURL: backendURL + 'auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email'], //optional
    },
    async function (accessToken, refreshToken, profile, done) {
      userInfo = profile;
      return done(null, profile);
    }
  )
);

const loginGithub = passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET_KEY,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      // callbackURL: backendURL + 'auth/github/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//======={Google}============================

app.get(
  '/auth/google',
  loginGoogle.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/auth/google/callback',
  loginGoogle.authenticate('google', {
    successRedirect: '/users/authSucessGoogle',
    failureRedirect: '/users/authErrorGoogle',
  })
);

//=====================================================================================

//======={Facebook}==========================

app.get(
  '/auth/facebook',
  loginFacebook.authenticate('facebook', { scope: 'email' })
);

app.get(
  '/auth/facebook/callback',
  loginFacebook.authenticate('facebook', {
    successRedirect: '/users/authSucessFacebook',
    failureRedirect: '/users/authErrorFacebook',
  })
);

//======={Github}==========================
app.get(
  '/auth/github',
  loginGithub.authenticate('github', { scope: ['user:email'] })
);

app.get(
  '/auth/github/callback',
  loginGithub.authenticate('github', {
    failureRedirect: '/users/authErrorloginGithub',
  }),
  function (req, res) {
    res.redirect('/users/authSucessGithub');
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});
//======={Facebook}==========================

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Middleware
app.use('/users', userRoute);
app.use('/contactus', contactRoute);

//============={Hotel Reservation }========================

//============={places}================
app.use('/places', placeRoute);
//============={Bookings}================
app.use('/bookings', bookingRoute);

app.use('/payment', paymentRoute);
app.use('/reservations', reservationRoute);

//====================={AUTH}====================================
//====================={AUTH}====================================

//======={using cloudinary}==================================

app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const url = await uploadImage(link);
  res.json(url);
});
//authSucessYandex', authSucessYandex);
// 'connect.sid': 's:-tvP5nygrd7WNVBfnH_pDCU4125Bkuen./9QOM42mL1Qvk8BH1UyuKFq0jEmGoOMLh13sBDGwKAw'

app.get('/authSucessYandex', async (req, res) => {
  let data = req.body;
  console.log({ data: data });

  console.log({ fullRequest: req });

  console.log({ cookies: req.cookies });
  console.log({ sessionID: req.sessionID });
  console.log({ session: req.session });
  // res.json(url);
});

const photosMiddleware = multer({ dest: '/tmp' });
app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    // const url = await uploadImage(req.files[i]);
    // uploadedFiles.push(url);

    const { path, originalname, mimetype } = req.files[i];

    console.log('originalPath', path);
    console.log('originalname', originalname);

    if (!mimetype.match(/jpe|jpeg|png|gif$i/)) {
      res.status(400).json('File is not supported');
    }

    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;

    const url = await uploadImage(path);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

// Routes
app.get('/', (req, res) => {
  res.send('Home Page');
});

// Error Middleware
app.use(errorHandler);
// Connect to DB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
