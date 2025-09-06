const express = require("express");
const {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  generateResetPassOTP,
  submitResetPassOTP,
  isloggedin,
} = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup", handelUserSignup);
router.post("/login", handelUserLogin);
router.post("/logout", handleUserLogout);

router.post("/forgot-password", generateResetPassOTP);
router.post("/reset-password", submitResetPassOTP);

router.get("/status", isloggedin);

module.exports = router;