const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.post("/verify", authController.verifyUser);
router.post("/getOtp", authController.getOtp);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);
router.get("/refreshToken", authController.refreshToken);

module.exports = router;
