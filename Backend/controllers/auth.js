const User = require("../models/User");
const bcrypt = require("bcrypt");
const SECRET_KEY = "crowdfunding@/@";
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "developertest1401@gmail.com",
    pass: "fubs qbll xfgf uamo",
  },
});

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

    const userExists = await User.findOne({ email });
    console.log(userExists);
    if (userExists)
      return res.status(500).json({ error: "User already exists" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      address,
      username,
      email,
      password: hashedPassword,
      otp,
    });

    await newUser.save();

    const mailOptions = {
      from: "crowdfunding@gmail.com",
      to: email,
      subject: "OTP for Account Verification",
      text: `Your OTP for account verification is: ${otp}`,
    };
    transporter.sendMail(mailOptions, (e, info) => {
      if (e) {
        console.log(e);
      } else {
        console.log("email has been sent", info.response);
      }
    });

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
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);
    console.log(expirationDate);
    res.status(200).json({ token, expiresIn: expirationDate });
  } catch (error) {
    res.status(500).json({ error: "No user found" });
  }
};

// VERIFYING USER BASED ON AN OTP
exports.verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email and OTP
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Update isVerified field to true
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
