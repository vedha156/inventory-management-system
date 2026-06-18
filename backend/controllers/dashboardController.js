const db = require("../config/db");

const getDashboard = (req,res)=>{

    const dashboard = {};

    db.query(
        "SELECT COUNT(*) AS totalProducts FROM products",
        (err,result1)=>{

            dashboard.totalProducts =
            result1[0].totalProducts;

            db.query(
                "SELECT COUNT(*) AS totalOrders FROM orders",
                (err,result2)=>{

                    dashboard.totalOrders =
                    result2[0].totalOrders;

                    db.query(
                        `
                        SELECT IFNULL(
                        SUM(total_amount),0
                        ) AS totalRevenue
                        FROM orders
                        WHERE status != 'Cancelled'
                        `,
                        (err,result3)=>{

                            dashboard.totalRevenue =
                            result3[0].totalRevenue;

                            db.query(
                                `
                                SELECT COUNT(*) AS pendingOrders
                                FROM orders
                                WHERE status='Pending'
                                `,
                                (err,result4)=>{

                                    dashboard.pendingOrders =
                                    result4[0].pendingOrders;

                                    db.query(
                                        `
                                        SELECT COUNT(*) AS lowStockProducts
                                        FROM products
                                        WHERE stock_quantity <= low_stock_limit
                                        `,
                                        (err,result5)=>{

                                            dashboard.lowStockProducts =
                                            result5[0].lowStockProducts;

                                            res.json(
                                                dashboard
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};

module.exports = {
    getDashboard
};