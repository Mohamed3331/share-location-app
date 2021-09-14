const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const getUsers = async (req, res) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    return res.status(404).send({error: 'something went wrong'})
  }
  res.send({users});
};

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({error: 'Validation error'});
  }

  const { name, email, password } = req.body;

  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    return err
  }
  
  if (existingUser) {
    return res.status(404).json({message: 'User exists already, please login instead.'})
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.status(404).json({message: 'Issue with hashing password'})
  }


  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  });

  await createdUser.save();

  let token;
  try {
    token = jwt.sign({ userId: createdUser.id, email: createdUser.email },'supersecret_dont_share_please', { expiresIn: 2000 });
  } catch (err) {
    return res.json({message: "Something weng wrong with the cookie/token"})
  }
  
  res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token});
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    return res.json({message: "User is not in the database"})
  }

  if (!existingUser) {
    return res.status(404).json({message: 'Login Invalid'})
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res.json({message: "Wrong credentials please try again"})
  }

  if (!isValidPassword) {
    return res.json({message: "Invalid credentials, could not log you in"})
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, 'supersecret_dont_share_please', { expiresIn: '1hr' });

  } catch (err) {
    return res.json({message: "Something weng wrong with the cookie/token"})
  }

  res.status(200).json({message: 'Logged in!', userId: existingUser.id, email: existingUser.email, token});
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

