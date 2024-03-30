const express = require("express");
const router = express.Router();

const {
  verifyPayment,
  createInvestmentOrder,
} = require("../controllers/esewa");
const { investInProject } = require("../controllers/project");

router.get("/esewa/verify-payment", verifyPayment);
router.post("/projects/esewa/:pid/invest", createInvestmentOrder);

module.exports = router;
