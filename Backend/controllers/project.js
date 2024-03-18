const mongoose = require("mongoose");
const Project = require("../models/Project");
const Comment = require("../models/Comment");
const { Story, Update } = require("../models/Update");
const Reward = require("../models/Reward");
const Investor = require("../models/Investor");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    return res.json({ data: projects });
  } catch (e) {
    res.status(500).json({ message: "Some error occurred" });
  }
};

exports.createProject = async (req, res) => {
  const {
    title,
    subtitle,
    description,
    endDate,
    goalAmount,
    category,
    location,
    minimumInvestment,
  } = req.body;
  const author = req.userId;
  if (
    !title ||
    !author ||
    !endDate ||
    !description ||
    !goalAmount ||
    !location ||
    !minimumInvestment
  ) {
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
      location,
      minimumInvestment,
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

    const investors = await Investor.find({ projectId: project._id }).populate(
      "investorId",
      "-_id username",
    );

    return res.json({ data: { project, comments, story, update, investors } });
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

exports.investInProject = async (req, res) => {
  const projectId = req.params.projectId;
  const investedAmount = req.body.investmentAmount;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(400)
        .json({ message: "Please provide a valid project id" });
    }

    if (investedAmount < project.minimumInvestment) {
      return res.status(400).json({
        message: `The minimum investment amount should be ${project.minimumInvestment}`,
      });
    }
    const investor = new Investor({
      projectId,
      investorId: req.userId,
      investedAmount,
    });

    await investor.save();

    // creating a reward for each investor
    const reward = new Reward({
      projectId,
      userId: req.userId,
    });

    await reward.save();

    return res.json({ message: "Invested in the project successfully" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some internal error occurred" });
  }
};
