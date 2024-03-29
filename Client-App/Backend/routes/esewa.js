const express = require("express");
const router = express.Router();

const { verifyPayment } = require("../controllers/esewa");
const { investInProject } = require("../controllers/project");

router.get("/esewa/verify-payment", verifyPayment);
router.post("/esewa/orders/create", investInProject);

module.exports = router;
