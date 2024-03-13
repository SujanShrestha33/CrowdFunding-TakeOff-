const { default: mongoose } = require("mongoose");
const Project = require("../models/Project");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    return res.json({ data: projects });
  } catch (e) {
    res.status(500).json({ message: "Some error occurred" });
  }
};

exports.createProject = async (req, res) => {
  const { title, description, author, endDate, goalAmount, category } =
    req.body;
  if (!title || !author || !endDate || !description || !goalAmount) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }
  try {
    const newProject = new Project({
      title,
      author,
      description,
      goalAmount,
      endDate,
      category,
    });
    await newProject.save();
    return res.status(201).json({ message: "Project created successfully" });
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
    return res.json({ data: project });
  } catch (e) {
    return res.status(500).json({ message: "Some error occurred internally" });
  }
};
