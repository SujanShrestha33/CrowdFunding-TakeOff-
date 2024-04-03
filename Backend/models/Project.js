const mongoose = require("mongoose");

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

ProjectSchema.pre("save", function (next) {
  if (this.currentAmount >= this.goalAmount) {
    this.status = "completed";
  }
  if (this.endDate < Date.now() && this.currentAmount < this.goalAmount) {
    this.status = "failed";
  }
  next();
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
