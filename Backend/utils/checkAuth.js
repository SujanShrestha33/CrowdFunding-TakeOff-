const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  const tokenData = req.headers.authorization;
  console.log(req.headers);
  console.log(tokenData);

  if (!tokenData) {
    return res.status(401).json({ message: "No token found" });
  }

  const incomingAccessToken = tokenData.split(" ")[1];
  console.log(incomingAccessToken);

  const decoded = jwt.verify(
    incomingAccessToken,
    process.env.ACCESS_TOKEN_SECRET,
  );
  console.log(decoded);
  if (!decoded.userId) {
    return res.status(401).json({ message: "Invalid access token" });
  }

  req.userId = decoded.userId;

  next();
}

module.exports = checkAuth;
