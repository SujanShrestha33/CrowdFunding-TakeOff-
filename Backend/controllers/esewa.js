<<<<<<< HEAD


exports.verifyPayment = async (req, res, next) => {
  const data = req.query.data
  let decodedString = atob(data);
  console.log("dec_string", decodedString)
=======
const crypto = require("crypto");
const Project = require("../models/Project");
const Reward = require("../models/Reward");
const Investor = require("../models/Investor");
const User = require("../models/User");

exports.verifyPayment = async (req, res, next) => {
  try {
    const { data } = req.query;
    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8"),
    );
    console.log(decodedData);

    if (decodedData.status !== "COMPLETE") {
      return res.status(400).json({ messgae: "errror" });
    }
    const message = decodedData.signed_field_names
      .split(",")
      .map(field => `${field}=${decodedData[field] || ""}`)
      .join(",");
    console.log(message);
    const signature = this.createSignature(message);

    if (signature !== decodedData.signature) {
      res.json({ message: "integrity error" });
    }

    const project = await Project.findById(decodedData.transaction_uuid);
    const investedAmount = Number(decodedData.total_amount);
    console.log("The investment amount is " + investedAmount);

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
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
>>>>>>> f8e3fe274413269cb76e75b7f711ccc7c1e96088
};
