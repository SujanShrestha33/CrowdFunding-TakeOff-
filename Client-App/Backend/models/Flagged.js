const mongoose = require("mongoose");

const flaggedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const Flagged = mongoose.model("Flagged", flaggedSchema);

module.exports = Flagged;
