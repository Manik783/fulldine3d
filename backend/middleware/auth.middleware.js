const AdminModel = require("../models/admin.model");
const RestaurantModel = require("../models/restaurant.model");
const BlackListToken = require("../models/blackListToken.model");
const jwt = require("jsonwebtoken");
module.exports.adminAuth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Unauthorized access {middleware}" });
  const isBlacklisted = await BlackListToken.findOne({ token: token });
  if (isBlacklisted)
    return res
      .status(401)
      .json({ message: "Unauthorized access (middleware)" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminModel.findById(decoded._id);

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized request " });
    }
    req.admin = admin;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized request " });
  }
};

module.exports.clientAuth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Unauthorized access {middleware}" });
  const isBlacklisted = await BlackListToken.findOne({ token: token });

  if (isBlacklisted)
    return res
      .status(401)
      .json({ message: "Unauthorized access (middleware)" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await RestaurantModel.findById(decoded._id);
    if (!client) {
      return res.status(401).json({ message: "Unauthorized request " });
    }
    req.client = client;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized request " });
  }
};

module.exports.adddish = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Unauthorized access {middleware}" });
  const isBlacklisted = await BlackListToken.findOne({ token: token });
  if (isBlacklisted)
    return res
      .status(401)
      .json({ message: "Unauthorized access (middleware)" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await RestaurantModel.findById(decoded._id);
    const admin = await AdminModel.findById(decoded._id);
    if (!client && !admin) {
      return res.status(401).json({ message: "Unauthorized request " });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized request " });
  }
};
