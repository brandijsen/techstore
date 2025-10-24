const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const addressController = require("../controllers/customerAddress.controller");

// Rotte protette
router.get("/", authenticate, addressController.getAddresses);
router.post("/", authenticate, addressController.createAddress);
router.put("/:id", authenticate, addressController.updateAddress);
router.delete("/:id", authenticate, addressController.deleteAddress);

module.exports = router;
