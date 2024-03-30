const crypto = require("crypto");
const Project = require("../models/Project");
const Reward = require("../models/Reward");
const Investor = require("../models/Investor");
const User = require("../models/User");
const fetch = require("node-fetch");
const { v4 } = require("uuid");

exports.createInvestmentOrder = async (req, res, next) => {
  const { investmentAmount } = req.body;
  const projectId = req.params.pid + "-" + v4();
  console.log(
    "The project id and invest amount  is ",
    projectId,
    investmentAmount,
  );
  const signature = this.createSignature(
    `total_amount=${investmentAmount},transaction_uuid=${projectId},product_code=EPAYTEST`,
  );
  const formData = {
    amount: investmentAmount,
    failure_url: "http://localhost:4200",
    product_delivery_charge: "0",
    product_service_charge: "0",
    product_code: "EPAYTEST",
    signature: signature,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    success_url: "http://localhost:8080/esewa/verify-payment",
    tax_amount: "0",
    total_amount: investmentAmount,
    transaction_uuid: projectId,
  };

  res.json({
    message: "Order Created Sucessfully",
    formData,
    payment_method: "esewa",
  });
};

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
      .map((field) => `${field}=${decodedData[field] || ""}`)
      .join(",");
    console.log(message);

    if (decodedData.signature !== "COMPLETE") {
      return res.redirect(
        `http://localhost:4200/project-view/${decodedData.transaction_uuid}/new`,
      );
    }
    const projectId = decodedData.transaction_uuid.split("-")[0];
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

    return res.redirect("http://localhost:4200/main/investment-success");
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
};

exports.createSignature = (message) => {
  const secret = "8gBm/:&EnhH.1/q";
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);

  // Get the digest in base64 format
  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
};
