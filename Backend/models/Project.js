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
  investors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  category: {
    type: String,
    enum: ["Art", "Fashion", "Technology", "Food", "Music"],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
