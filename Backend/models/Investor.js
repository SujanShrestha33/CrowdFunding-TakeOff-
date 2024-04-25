const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    investedAmount: {
      type: Number,
      required: true,
    },
    rewards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reward",
      },
    ],
  },
  { timestamps: true },
);

const Investor = mongoose.model("Investor", investorSchema);

module.exports = Investor;
