const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
});

const Bookmark = mongoose.model("bookmark", bookmarkSchema);

module.exports = Bookmark;
