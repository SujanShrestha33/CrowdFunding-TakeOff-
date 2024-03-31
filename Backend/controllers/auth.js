const User = require("../models/User");
const bcrypt = require("bcrypt");
const SECRET_KEY = "crowdfunding@/@";
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generateAccessAndRefreshTokens = require("../utils/generateTokens");

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
  const adminEmails = ["prasannajung08@gmail.com", "sujanshress33@gmail.com"];
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
      return res.status(500).json({ message: "User already exists" });

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

    if (adminEmails.includes(email)) {
      newUser.role = "admin";
    }

    const createdUser = await newUser.save();

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

    res.status(201).json({ message: "User registered", data: createdUser });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Unable to register the user" });
  }
};

exports.loginUser = async (req, res) => {
  console.log("Login route hit with data ", req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User doesn't exist" });
    }

    const isUserVerified = user.isVerified;

    if (!isUserVerified) {
      return res.status(401).json({
        message: "User is not verified, Please verify through Signup page!",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user);

    const accessExpiryInHours = 1 * 24;
    const refreshExpiryInHours = 7 * 24;

    const accessExpirationDate = new Date(
      Date.now() + accessExpiryInHours * 60 * 60 * 1000,
    );
    const refreshExpirationDate = new Date(
      Date.now() + refreshExpiryInHours * 60 * 60 * 1000,
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    res.status(200).cookie("refreshToken", refreshToken, cookieOptions).json({
      accessToken,
      refreshToken,
      accessExpiresIn: accessExpirationDate,
      refreshExpiresIn: refreshExpirationDate,
      userId: user._id,
      userRole: user.role,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "No user found" });
  }
};

// VERIFYING USER BASED ON AN OTP
exports.verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email and OTP
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update isVerified field to true
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "Email Already Verified, Proceed to login!" });
    }

    const mailOptions = {
      from: "crowdfunding@gmail.com",
      to: email,
      subject: "OTP for Account Verification",
      text: `Your OTP for account verification is: ${user.otp}`,
    };
    transporter.sendMail(mailOptions, (e, info) => {
      if (e) {
        console.log(e);
      } else {
        console.log("email has been sent", info.response);
      }
    });
    return res.status(200).json({ message: "Email successfully sent" });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "No user found" });
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
    expiresIn: "15m",
  });

  const resetLink = `http://localhost:4200/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: "crowdfunding@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click on the following link to reset your password: ${resetLink}`,
  };
  ``;
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Error sending email" });
    }
    res.status(200).json({ message: "Password reset email sent" });
  });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const decoded = jwt.verify(token, SECRET_KEY);
  if (!decoded.userId) {
    return res.status(401).json({ msg: "Invalid token" });
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(404).json({ msg: "No Such user found" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ msg: "Password successfully reset" });
};

exports.refreshToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    return res.status(400).json({ message: "Token not found" });
  }
  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  const user = await User.findById(decoded?.userId);
  if (!user) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (user.refreshToken !== incomingRefreshToken) {
    return res.status(401).json({ message: "Token is expired" });
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user);

  const accessExpiryInHours = 1 * 24;
  const refreshExpiryInHours = 7 * 24;

  const accessExpirationDate = new Date(
    Date.now() + accessExpiryInHours * 60 * 60 * 1000,
  );
  const refreshExpirationDate = new Date(
    Date.now() + refreshExpiryInHours * 60 * 60 * 1000,
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      accessToken,
      refreshToken,
      accessExpiresIn: accessExpirationDate,
      refreshExpiresIn: refreshExpirationDate,
    });
};
