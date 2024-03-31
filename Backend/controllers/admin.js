// an admin is allowed to view all users, delete projects

const Project = require("../models/Project");
const User = require("../models/User");

// create a function to get all the investors in a given project
exports.getInvestors = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const project = await Investor.find({ projectId: projectId }).populate(
      "investorId",
      "-password -_id -__v",
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ data: project });
  } catch (e) {
    res.status(500).json({ message: "Some error occurred" });
  }
};

exports.deleteProject = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ data: deletedProject });
  } catch (e) {
    res.status(500).json({ message: "Some error occurred" });
  }
};
