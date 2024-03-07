const authServices = require("./auth/services");

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    logger.warn("Authorization token missing");
    return res.status(401).json({});
  }

  if (!authServices.validateAccessToken(token)) {
    logger.warn("Invalid access token");
    return res.status(401).json({});
  }

  next();
}

module.exports = {
  auth,
};
