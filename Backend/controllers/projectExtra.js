const { Update, Story } = require("../models/Update");

exports.createUpdate = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(200)
      .json({ message: "Provide both title and description" });
  }
  try {
    const newUpdate = new Update({
      title,
      description,
      projectId: req.params.projectId,
    });
    await newUpdate.save();
    return res.json({ message: "Update created successfully" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some internal error occurred" });
  }
};

exports.createStory = async (req, res) => {
  console.log("create story is hit");

  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "Please provide description" });
  }
  try {
    const story = new Story({
      description,
      projectId: req.params.projectId,
    });
    await story.save();
    return res.json({ message: "Story successfully created" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some internal error occurred" });
  }
};
