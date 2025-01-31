const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: "string",
    required: true,
  },
});

adminSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

adminSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel;
