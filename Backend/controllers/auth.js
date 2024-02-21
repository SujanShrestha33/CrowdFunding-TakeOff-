const User = require("../models/User");
const bcrypt = require("bcrypt");
const SECRET_KEY = "crowdfunding@/@";
const jwt = require("jsonwebtoken");

exports.signupUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      username,
      email,
      password,
    } = req.body;
    console.log(req.body);
    const userExists = User.findOne({ email });
    if (userExists)
      return res.status(500).json({ error: "User already exists" });
    console.log(firstName, lastName, phoneNumber);
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      address,
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
    res.status(201).json({ message: "User registered" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: "Unable to register the user" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User doesn't exist" });
    }
    console.log(user);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, expiresIn: "1h" },
      SECRET_KEY,
      {
        expiresIn: "1h",
      },
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "No user found" });
  }
};
