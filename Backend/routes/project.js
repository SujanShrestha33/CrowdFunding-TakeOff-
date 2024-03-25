const router = require("express").Router();

const upload = require("../middlewares/fileUpload");

const projectController = require("../controllers/project");
const projectExtraController = require("../controllers/projectExtra");
const checkAuth = require("../utils/checkAuth");

router.get("/projects", projectController.getAllProjects);
router.post(
  "/create-project",
  checkAuth,
  upload.single("file"),
  projectController.createProject,
);
router.get("/projects/:projectId", projectController.getOneProject);
router.post(
  "/projects/:projectId/comment",
  checkAuth,
  projectController.addComment,
);

router.post(
  "/projects/:projectId/story",
  checkAuth,
  projectExtraController.createStory,
);
router.post(
  "/projects/:projectId/update",
  checkAuth,
  projectExtraController.createUpdate,
);

router.post(
  "/projects/:projectId/invest",
  checkAuth,
  projectController.investInProject,
);
router.post(
  "/projects/:projectId/reward",
  checkAuth,
  projectController.createReward,
);

router.post(
  "/projects/:projectId/addMedia",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "imageFileOne", maxCount: 1 },
    { name: "imageFileTwo", maxCount: 1 },
    { name: "imageFileThree", maxCount: 1 },
  ]),
  projectController.addMediaAssets,
);

module.exports = router;
