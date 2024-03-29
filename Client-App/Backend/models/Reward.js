const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  rewardTitle: {
    type: String,
    required: true,
  },
  rewardDescription: {
    type: String,
    required: true,
  },
  rewardAmount: {
    type: Number,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
});

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward;
