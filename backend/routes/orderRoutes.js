const express = require("express");

const router =
express.Router();

const {
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getOrders
} = require("../controllers/orderController");

const verifyToken =
require("../middleware/authMiddleware");

router.post(
    "/",
    verifyToken,
    createOrder
);

router.put(
    "/:id/status",
    verifyToken,
    updateOrderStatus
);

router.put(
    "/:id/cancel",
    verifyToken,
    cancelOrder
);

router.get(
    "/",
    verifyToken,
    getOrders
);

module.exports = router;