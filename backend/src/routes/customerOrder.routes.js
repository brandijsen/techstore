const express = require("express");
const router = express.Router();
const controller = require("../controllers/customerOrder.controller");
const authenticate = require("../middlewares/authenticate"); // <— aggiungi

// Tutte queste rotte richiedono login
router.post("/", authenticate, controller.createOrder);
router.post("/:id/confirm", authenticate, controller.confirmOrder);
router.get("/:id", authenticate, controller.getOrder);
router.get("/customer/:customerId", authenticate, controller.getOrdersByCustomer);

module.exports = router;
