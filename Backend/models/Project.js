const mongoose = require("mongoose");
const User = require("./User");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: String,
  goalAmount: {
    required: true,
    type: Number,
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ["Art", "Fashion", "Technology", "Others", "Music", "Games", "Books"],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  minimumInvestment: {
    type: Number,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  mediaAssets: [String],
  bookmarkCount: {
    type: Number,
    default: 0,
  },
  flagCount: {
    type: Number,
    default: 0,
  },
  // since project will also have a status field, we can add it here
  status: {
    type: String,
    enum: ["active", "failed", "completed"],
    default: "active",
  },
  // add a field to allow twitter , facebook and instagram links for the project
  socialLinks: {
    type: Map,
    of: String,
  },
});

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

ProjectSchema.pre("save", async function (next) {
  if (this.currentAmount >= this.goalAmount) {
    this.status = "completed";
    // find the author by id first
    const author = await User.findById(this.author);
    console.log("Thr author inside project status is ", author);
    // send email to the author
    const mailOptions = {
      from: "crowdfunding@gmail.com",
      to: author.email,
      subject: "Project Completed",
      text: ` Congratulations! Your project ${this.title} has been successfully completed.`,
    };
    transporter.sendMail(mailOptions, (e, info) => {
      if (e) {
        console.log(e);
      } else {
        console.log("email has been sent", info.response);
      }
    });
  }
  if (this.endDate < Date.now() && this.currentAmount < this.goalAmount) {
    this.status = "failed";

    const author = await User.findById(this.author);
    console.log("Thr author inside project status is ", author);

    // send email to the author
    const mailOptions = {
      from: "crowdfunding@gmail.com",
      to: author.email,
      subject: "Project Failed",
      text: ` We are sorry to inform you that your project ${this.title} has failed to reach its goal amount.`,
    };
    transporter.sendMail(mailOptions, (e, info) => {
      if (e) {
        console.log(e);
      } else {
        console.log("email has been sent", info.response);
      }
    });
  }
  next();
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
