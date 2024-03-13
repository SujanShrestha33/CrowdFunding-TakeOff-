const router = require("express").Router();

const projectController = require("../controllers/project");
const checkAuth = require("../utils/checkAuth");

router.get("/projects", projectController.getAllProjects);
router.post("/create-project", checkAuth, projectController.createProject);
router.get("/projects/:projectId", projectController.getOneProject);

module.exports = router;
