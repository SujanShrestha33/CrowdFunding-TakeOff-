const jwt = require("jsonwebtoken");

function generateAccessAndRefreshTokens(user) {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
  );
  const refreshToken = jwt.sign(
    {
      userId: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
}

module.exports = generateAccessAndRefreshTokens;
