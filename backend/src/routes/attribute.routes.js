const express = require("express");
const router = express.Router();
const attributeController = require("../controllers/attribute.controller");

router.get("/", attributeController.getAttributes);
router.get("/:id", attributeController.getAttribute);
router.post("/", attributeController.createAttribute);
router.put("/:id", attributeController.updateAttribute);
router.delete("/:id", attributeController.deleteAttribute);

module.exports = router;
