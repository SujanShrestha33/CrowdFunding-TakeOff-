const router = require("express").Router();

const projectController = require("../controllers/project");

router.get("/projects", projectController.getAllProjects);
router.post("/create-project", projectController.createProject);
router.get("/projects/:projectId", projectController.getOneProject);

module.exports = router;
