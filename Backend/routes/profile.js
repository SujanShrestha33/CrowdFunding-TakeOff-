const router = require("express").Router();
const checkAuth = require("../utils/checkAuth");
const profileController = require("../controllers/profile");

router.get("/profile/my", checkAuth, profileController.getUserProfile);

router.get("/profile/myToken", checkAuth, profileController.getUserToken);

router.post(
  "/profile/my/update",
  checkAuth,
  profileController.updateUserProfile,
);

module.exports = router;
