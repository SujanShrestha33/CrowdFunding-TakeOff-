const router = require("express").Router();
const adminController = require("../controllers/admin");

const checkAuth = require("../utils/checkAuth");
const isAdmin = require("../utils/isAdmin");

// route to get all investors in a project
router.get(
  "/admin/:projectId/investors",
  checkAuth,
  isAdmin,
  adminController.getInvestors,
);

// route to delete a project
router.post(
  "/admin/delete/:projectId",
  checkAuth,
  isAdmin,
  adminController.deleteProject,
);

// route to update status of a project
router.post(
  "/admin/project/status/:projectId",
  checkAuth,
  isAdmin,
  adminController.updateProjectStatus,
);

module.exports = router;
