const express = require("express");
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUserProfile
} = require("../controllers/userController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// User profile
router.get("/profile", getUserProfile);

// Address management
router.post("/address", addAddress);
router.get("/addresses", getAddresses);
router.put("/address/:addressId", updateAddress);
router.delete("/address/:addressId", deleteAddress);
router.patch("/address/:addressId/default", setDefaultAddress);

module.exports = router;