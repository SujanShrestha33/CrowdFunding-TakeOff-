const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward;
