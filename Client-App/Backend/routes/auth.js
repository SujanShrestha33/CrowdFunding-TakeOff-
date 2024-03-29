const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.post("/verify", authController.verifyUser);
router.post("/getOtp", authController.getOtp);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);
router.get("/refreshToken", authController.refreshToken);

module.exports = router;
