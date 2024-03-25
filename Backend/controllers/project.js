const mongoose = require("mongoose");
const Project = require("../models/Project");
const Comment = require("../models/Comment");
const { Story, Update } = require("../models/Update");
const Reward = require("../models/Reward");
const Investor = require("../models/Investor");
const User = require("../models/User");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    return res.json({ data: projects });
  } catch (e) {
    res.status(500).json({ message: "Some error occurred" });
  }
};

exports.createProject = async (req, res) => {
  console.log(req.file);
  const receivedImageFile = req.file;

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
    !minimumInvestment ||
    !receivedImageFile
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
      coverImage: "uploads/" + req.file.filename,
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
    console.log(project);
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
    const rewards = await Reward.find({ projectId: project._id });

    const investors = await Investor.find({ projectId: project._id }).populate(
      "investorId",
      "-_id username",
    );

    return res.json({
      data: { project, comments, story, update, investors, rewards },
    });
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

    project.currentAmount = project.currentAmount + investedAmount;

    const investor = await User.findById(req.userId);
    investor.token = investor.token + 1;

    const rewards = await Reward.find({
      projectId: projectId,
      rewardAmount: { $lte: investedAmount },
    });

    const newInvestor = new Investor({
      projectId,
      investorId: req.userId,
      investedAmount,
      rewards: rewards,
    });

    newInvestor.rewards.concat(rewards);
    console.log(newInvestor);

    await newInvestor.save();

    return res.json({ message: "Invested in the project successfully" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some internal error occurred" });
  }
};

exports.createReward = async (req, res) => {
  const projectId = req.params.projectId;
  const { rewardTitle, rewardAmount, rewardDescription } = req.body;
  console.log(req.body);
  if (!rewardTitle || !rewardAmount || !rewardDescription) {
    return res
      .status(400)
      .json({ message: "Please provide all the necessary fields" });
  }
  try {
    const newReward = new Reward({
      rewardTitle,
      rewardDescription,
      rewardAmount,
      projectId,
    });

    await newReward.save();
    return res.json({ message: "Reward created successfully" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some internal error occurred" });
  }
};

exports.addMediaAssets = async (req, res) => {
  const projectId = req.params.projectId;
  const assetsArray = Object.values(req.files);

  const pathStringArray = assetsArray.map(file => {
    return "uploads/" + file[0].filename;
  });
  console.log(pathStringArray);

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(200).json({ message: "No such project found!" });
    }

    project.mediaAssets = pathStringArray;
    await project.save();
  } catch (e) {
    console.log(e.message);
  }
};
