// an admin is allowed to view all users, delete projects

const Project = require("../models/Project");
const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.json({ data: users });
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
