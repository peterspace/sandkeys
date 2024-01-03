const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error('Not authenticated!');
    }

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get user id from token
    const user = await User.findById(verified.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, please login');
    // throw new Error('Not ready');
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== 'Admin') {
    throw new Error('You are not an admin');
  } else {
    next();
  }
});

const isPartner = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (user.role !== 'Partner') {
    throw new Error('You are not a partner');
  } else {
    next();
  }
});

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // to get the token // {"Bearer": `${token}`}
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error('Not Authorized token expired, Please Login again');
    }
  } else {
    throw new Error(' There is no token attached to header');
  }
});

const protectJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error('Not authorized, please login');
    }

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get user id from token
    const user = await User.findById(verified.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, please login');
  }
});

// module.exports = protect;
module.exports = {
  protect,
  isAdmin,
  isPartner,
  authMiddleware,
  protectJWT,
};
