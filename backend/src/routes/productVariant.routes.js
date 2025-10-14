const express = require("express");
const router = express.Router();
const controller = require("../controllers/productVariant.controller");

router.get("/product/:productId", controller.getVariantsByProduct);
router.get("/:id", controller.getVariant);
router.post("/", controller.createVariant);
router.put("/:id", controller.updateVariant);
router.delete("/:id", controller.deleteVariant);

module.exports = router;
