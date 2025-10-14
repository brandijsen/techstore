const express = require("express");
const router = express.Router();
const controller = require("../controllers/productFull.controller");

router.post("/full", controller.createFullProduct);
router.get("/:id/full", controller.getFullProduct);

module.exports = router;
