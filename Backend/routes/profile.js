const router = require("express").Router();
const checkAuth = require("../utils/checkAuth");
const profileController = require("../controllers/profile");

router.get("/profile/my", checkAuth, profileController.getUserProfile);

router.get("/profile/user/:userId", profileController.getAnyUserProfile);

router.post(
  "/profile/my/update",
  checkAuth,
  profileController.updateUserProfile,
);

module.exports = router;
