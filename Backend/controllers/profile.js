const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const userAccount = await User.findById(userId).select(
      "-_id firstName lastName phoneNumber address username",
    );

    return res.status(200).json({ data: userAccount });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some internal error occurred" });
  }
};

exports.updateUserProfile = async (req, res) => {
  const userId = req.userId;
  const { firstName, lastName, phoneNumber, address, username } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phoneNumber,
        address,
        username,
      },
      { new: true },
    ).select("-_id firstName lastName phoneNumber address username");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data: updatedUser });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some internal error occurred" });
  }
};
