const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true },
);

const storySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
});

const Story = mongoose.model("Story", storySchema);
const Update = mongoose.model("Update", updateSchema);

module.exports = { Story, Update };
