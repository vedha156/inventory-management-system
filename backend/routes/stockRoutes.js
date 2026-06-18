const express = require("express");

const router =
express.Router();

const {
    addStock,
    reduceStock
} = require("../controllers/stockController");

const verifyToken =
require("../middleware/authMiddleware");

const authorize =
require("../middleware/roleMiddleware");

router.post(
    "/add",
    verifyToken,
    authorize("admin"),
    addStock
);

router.post(
    "/reduce",
    verifyToken,
    authorize("admin"),
    reduceStock
);

module.exports = router;