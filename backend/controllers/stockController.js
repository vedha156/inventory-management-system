const db = require("../config/db");

const logAction =
require("../utils/auditLogger");

const addStock = (req,res)=>{

    const {
        product_id,
        quantity
    } = req.body;

    const updateSql = `
    UPDATE products
    SET stock_quantity =
    stock_quantity + ?
    WHERE id = ?
    `;

    db.query(
        updateSql,
        [quantity,product_id],
        (err,result)=>{

            if(err){
                return res.status(500).json({
                    message:err.message
                });
            }

            logAction(
                req.user.id,
                "ADD_STOCK",
                `Added ${quantity} units of product ${product_id}`
            );

            const historySql = `
            INSERT INTO stock_history
            (
                product_id,
                change_type,
                quantity
            )
            VALUES(?,?,?)
            `;

            db.query(
                historySql,
                [
                    product_id,
                    "ADD",
                    quantity
                ]
            );

            res.status(200).json({
                message:"Stock Added Successfully"
            });

        }
    );

};

const reduceStock = (req, res) => {

    const {
        product_id,
        quantity
    } = req.body;

    const getProductSql =
    "SELECT stock_quantity FROM products WHERE id=?";

    db.query(
        getProductSql,
        [product_id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Product Not Found"
                });
            }

            const currentStock =
            result[0].stock_quantity;

            if (currentStock < quantity) {

                return res.status(400).json({
                    message: "Insufficient Stock"
                });

            }

            const updateSql = `
            UPDATE products
            SET stock_quantity =
            stock_quantity - ?
            WHERE id = ?
            `;

            db.query(
                updateSql,
                [quantity, product_id],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    const historySql = `
                    INSERT INTO stock_history
                    (
                        product_id,
                        change_type,
                        quantity
                    )
                    VALUES(?,?,?)
                    `;

                    db.query(
                        historySql,
                        [
                            product_id,
                            "REDUCE",
                            quantity
                        ]
                    );

                    logAction(
                        req.user.id,
                        "REDUCE_STOCK",
                        `Reduced ${quantity} units from product ${product_id}`
                    );

                    res.status(200).json({
                        message:
                        "Stock Reduced Successfully"
                    });

                }
            );

        }
    );

};
const getAuditLogs = (req,res)=>{

    const sql = `
    SELECT *
    FROM audit_logs
    ORDER BY id DESC
    `;

    db.query(
        sql,
        (err,results)=>{

            if(err){
                return res.status(500).json({
                    message:err.message
                });
            }

            res.status(200).json(results);

        }
    );

};

module.exports = {
    addStock,
    reduceStock,
    getAuditLogs
};