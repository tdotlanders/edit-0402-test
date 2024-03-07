const authServices = require("./auth/services");

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({});
  }

  if (!authServices.validateAccessToken(token)) {
    return res.status(401).json({});
  }

  next();
}

module.exports = {
  auth,
};
