// an admin is allowed to view all users, delete projects

const Project = require("../models/Project");
const User = require("../models/User");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "developertest1401@gmail.com",
    pass: "fubs qbll xfgf uamo",
  },
});

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

// create a function to update the status of a project
exports.updateProjectStatus = async (req, res) => {
  const projectId = req.params.projectId;
  const { status } = req.body;
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { status },
      { new: true },
    );
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // find the author by id
    const author = await User.findById(updatedProject.author);

    // send email to the author
    const mailOptions = {
      from: "crowdfunding@gmail.com",
      to: author.email,
      subject: `Project ${updatedProject.title} status updated`,
      text: `Your project status has been updated to ${status}`,
    };
    transporter.sendMail(mailOptions, (e, info) => {
      if (e) {
        console.log(e);
      } else {
        console.log("email has been sent", info.response);
      }
    });

    return res.status(200).json({ data: updatedProject });
  } catch (e) {
    res.status(500).json({ message: "Some error occurred" });
  }
};
