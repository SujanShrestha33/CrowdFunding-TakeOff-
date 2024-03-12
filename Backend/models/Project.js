const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
