const router = require("express").Router();

const projectController = require("../controllers/project");
const projectExtraController = require("../controllers/projectExtra");
const checkAuth = require("../utils/checkAuth");

router.get("/projects", projectController.getAllProjects);
router.post("/create-project", checkAuth, projectController.createProject);
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

module.exports = router;
