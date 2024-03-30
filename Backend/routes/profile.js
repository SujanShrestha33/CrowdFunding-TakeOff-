const router = require("express").Router();
const checkAuth = require("../utils/checkAuth");
const profileController = require("../controllers/profile");
const projectController = require("../controllers/project");

router.get("/profile/my", checkAuth, profileController.getUserProfile);

router.get("/profile/myToken", checkAuth, profileController.getUserToken);

router.post(
  "/profile/my/update",
  checkAuth,
  profileController.updateUserProfile,
);

router.get(
  "/user/investments",
  checkAuth,
  projectController.getUserInvestments,
);

module.exports = router;
