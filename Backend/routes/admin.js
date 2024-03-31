const router = require("express").Router();
const adminController = require("../controllers/admin");

// route to get all investors in a project
router.get("/admin/:projectId/investors", adminController.getInvestors);

// route to delete a project
router.delete("/admin/delete/:projectId", adminController.deleteProject);

module.exports = router;
