const express = require("express");
const router = express.Router();
const checkAuth = require("../utils/checkAuth");

const {
  verifyPayment,
  createInvestmentOrder,
} = require("../controllers/esewa");
const { investInProject } = require("../controllers/project");

router.get("/esewa/verify-payment" ,verifyPayment);
router.post("/projects/esewa/:pid/invest", checkAuth,createInvestmentOrder);

module.exports = router;
