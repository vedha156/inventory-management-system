require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();

const db = require("./config/db");

const authRoutes =
require("./routes/authRoutes");

const productRoutes =
require("./routes/productRoutes");

const stockRoutes =
require("./routes/stockRoutes");

const orderRoutes =
require("./routes/orderRoutes");

const dashboardRoutes =
require("./routes/dashboardRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/stock", stockRoutes);

app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req,res)=>{
    res.send("Inventory Management Backend Running");
});

const PORT = process.env.PORT || 5000;

const verifyToken =
require("./middleware/authMiddleware");
app.get(
    "/protected",
    verifyToken,
    (req, res) => {

        res.json({
            message: "Protected Route Accessed",
            user: req.user
        });

    }
);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});