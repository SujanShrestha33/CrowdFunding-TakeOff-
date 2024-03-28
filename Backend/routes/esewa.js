const express = require("express");
const router = express.Router();

const { verifyPayment } = require("../controllers/esewa");

router.post("/esewa/verify-payment", verifyPayment);

module.exports = router;
