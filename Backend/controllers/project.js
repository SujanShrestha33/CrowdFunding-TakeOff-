const mongoose = require("mongoose");
const Project = require("../models/Project");
const Comment = require("../models/Comment");
const { Story, Update } = require("../models/Update");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    return res.json({ data: projects });
  } catch (e) {
    res.status(500).json({ message: "Some error occurred" });
  }
};

exports.createProject = async (req, res) => {
  const { title, subtitle, description, endDate, goalAmount, category } =
    req.body;
  const author = req.userId;
  if (!title || !author || !endDate || !description || !goalAmount) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }
  try {
    const newProject = new Project({
      title,
      author,
      subtitle,
      description,
      goalAmount,
      endDate,
      category,
    });
    const createdProject = await newProject.save();
    return res
      .status(201)
      .json({ message: "Project created successfully", data: createdProject });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Some error occurred internally" });
  }
};

exports.getOneProject = async (req, res) => {
  const id = req.params.projectId;
  try {
    const project = await Project.findById(id);
    const comments = await Comment.find({ projectId: project._id }).populate(
      "createdBy",
      "username -_id",
    );
    const story = await Story.find({ projectId: project._id }).select(
      "description -_id",
    );
    const update = await Update.find({ projectId: project._id }).select(
      "title description createdAt -_id",
    );

    return res.json({ data: { project, comments, story, update } });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some error occurred internally" });
  }
};

exports.addComment = async (req, res) => {
  const { content } = req.body;
  const projectId = req.params.projectId;
  const userId = req.userId;

  try {
    const comment = new Comment({
      content,
      projectId,
      createdBy: userId,
    });

    await comment.save();
    return res.json({ message: "Comment posted successfully" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: "Internal error occcurred. Could not post the comment",
    });
  }
};
