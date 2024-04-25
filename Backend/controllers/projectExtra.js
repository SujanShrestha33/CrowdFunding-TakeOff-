const { Update, Story } = require("../models/Update");
const Flagged = require("../models/Flagged");
const User = require("../models/User");
const Project = require("../models/Project");

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

exports.updateStory = async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "Please provide description" });
  }
  try {
    const story = await Story.findOne({ projectId: req.params.projectId });
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    story.description = description;
    await story.save();
    return res.json({ message: "Story successfully updated" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some internal error occurred" });
  }
};

exports.flagProject = async (req, res) => {
  const userId = req.userId;
  const { projectId } = req.params;

  try {
    const user = await User.findById(userId);
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (user.token < 10) {
      return res.status(400).json({ message: "Insufficient tokens" });
    }

    const isFlagged = await Flagged.findOne({ userId, projectId });
    if (isFlagged) {
      return res.status(400).json({ message: "Project already flagged" });
    }

    const newFlag = new Flagged({ userId, projectId });
    await newFlag.save();

    project.flagCount = project.flagCount + 1;
    await project.save();
    if (project.flagCount >= 10) {
      await Project.findByIdAndDelete(projectId);

      return res.status(200).json({ message: "Project successfully deleted" });
    }

    return res.status(200).json({ message: "Project successfully flagged" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some internal error occurred" });
  }
};
