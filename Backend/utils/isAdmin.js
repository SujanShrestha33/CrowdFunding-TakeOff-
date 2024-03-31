// middleware to check if user is admin and the userId is stored in req.userId

const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  } catch (e) {
    res.status(500).json({ message: "Some error occurred" });
  }
};

module.exports = isAdmin;
