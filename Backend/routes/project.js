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
  "/projects/:projectId/updateStory",
  checkAuth,
  projectExtraController.updateStory,
);

router.post(
  "/projects/:projectId/update",
  checkAuth,
  projectExtraController.createUpdate,
);

router.post(
  "/projects/:projectId/invest",
  // checkAuth,
  projectController.investInProject,
);
router.post(
  "/projects/:projectId/reward",
  checkAuth,
  projectController.createReward,
);

router.post(
  "/projects/:projectId/addMedia",
  checkAuth,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "imageFileOne", maxCount: 1 },
    { name: "imageFileTwo", maxCount: 1 },
    { name: "imageFileThree", maxCount: 1 },
  ]),
  projectController.addMediaAssets,
);
router.post(
  "/projects/:projectId/updateMedia",
  checkAuth,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "imageFileOne", maxCount: 1 },
    { name: "imageFileTwo", maxCount: 1 },
    { name: "imageFileThree", maxCount: 1 },
  ]),
  projectController.updateMediaAssets,
);

router.get("/users/myProjects", checkAuth, projectController.getUserProjects);

router.post(
  "/projects/createBookmark/:projectId",
  checkAuth,
  projectController.createBookmark,
);

router.post(
  "/projects/removeBookmark/:projectId",
  checkAuth,
  projectController.removeBookmark,
);

router.get(
  "/projects/bookmarks/myBookmarks",
  checkAuth,
  projectController.getUserBookmarks,
);

router.get("/trendingProjects", projectController.getTrendingProjects);

router.post(
  "/flagProject/:projectId",
  checkAuth,
  projectExtraController.flagProject,
);

module.exports = router;
