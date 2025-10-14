const express = require("express");
const router = express.Router();
const controller = require("../controllers/purchaseOrder.controller");
const authenticate = require("../middlewares/authenticate");

// tutte le rotte richiedono login staff
router.post("/", authenticate, controller.createPO);
router.post("/:id/receive", authenticate, controller.receivePO);
router.get("/:id", authenticate, controller.getPO);
router.get("/", authenticate, controller.getAllPO);

module.exports = router;
