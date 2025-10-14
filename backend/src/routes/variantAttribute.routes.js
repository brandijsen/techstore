const express = require("express");
const router = express.Router();
const controller = require("../controllers/variantAttribute.controller");

router.get("/variant/:variantId", controller.getAttributesByVariant);
router.post("/", controller.createVariantAttribute);
router.delete("/:id", controller.deleteVariantAttribute);

module.exports = router;
