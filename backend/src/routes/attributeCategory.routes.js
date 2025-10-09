const express = require("express");
const router = express.Router();
const controller = require("../controllers/attributeCategory.controller");

router.get("/category/:categoryId", controller.getByCategory);
router.post("/", controller.link);
router.delete("/", controller.unlink);

module.exports = router;
