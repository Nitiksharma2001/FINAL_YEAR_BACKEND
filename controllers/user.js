const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser._id, name: foundUser.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({ msg: "user logged in", token });
    } else {
      return res.status(400).json({ msg: "Bad password" });
    }
  } else {
    return res.status(400).json({ msg: "Bad credentails" });
  }
};

const data = [
  {
    _id: '1',
    name: 'Yogesh',
    temperature: '300',
    humidity: 'abcd',
    patientId: 'xyz',
  },
  {
    _id: '2',
    name: 'Yogesh',
    temperature: '300',
    humidity: 'abcd',
    patientId: 'ayz',
  },
  {
    _id: '3',
    name: 'Yogesh',
    temperature: '310',
    humidity: 'abcd',
    patientId: 'xyz',
  }
]

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
    data
  });
};

const getAllUsers = async (req, res) => {
  let users = await User.find({});
  
  return res.status(200).json({ users });
};

const register = async (req, res) => {
  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser === null) {
    let { username, email, password , role} = req.body;
    if (username.length && email.length && password.length && role.length) {
      const person = new User({
        name: username,
        email: email,
        password: password,
        role: role,
      });
      await person.save();
      return res.status(201).json({ person });
    }else{
        return res.status(400).json({msg: "Please add all values in the request body"});
    }
  } else {
    return res.status(400).json({ msg: "Email already in use" });
  }
};

module.exports = {
  login,
  register,
  dashboard,
  getAllUsers,
};