const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ status: 401, message: "Access token not found" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.userId = decoded.userId;
    req.userName = decoded.userName;
    req.permissions = decoded.permissions;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ status: 403, message: "Code is invalid or expired" });
  }
};

module.exports = verifyToken;
