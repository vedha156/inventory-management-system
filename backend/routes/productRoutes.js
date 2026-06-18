const express = require("express");

const router = express.Router();

const {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    getAuditLogs
} = require("../controllers/productController");

const verifyToken =
require("../middleware/authMiddleware");

const authorize =
require("../middleware/roleMiddleware");

router.post(
    "/",
    verifyToken,
    authorize("admin"),
    createProduct
);

router.get(
    "/",
    verifyToken,
    getProducts
);
router.put(
    "/:id",
    verifyToken,
    authorize("admin"),
    updateProduct
);  
router.delete(
    "/:id",
    verifyToken,
    authorize("admin"),
    deleteProduct
);

router.get(
    "/low-stock",
    verifyToken,
    getLowStockProducts
);

router.get(
    "/audit-logs",
    verifyToken,
    getAuditLogs
);

module.exports = router;