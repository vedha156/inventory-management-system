const db = require("../config/db");

const createOrder = (req, res) => {

    const { products } = req.body;

    let totalAmount = 0;

    const checkStock = (index = 0) => {

        if (index === products.length) {

            createOrderRecord();
            return;
        }

        const item = products[index];

        db.query(
            "SELECT stock_quantity FROM products WHERE id=?",
            [item.product_id],
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

                if (
                    result[0].stock_quantity <
                    item.quantity
                ) {
                    return res.status(400).json({
                        message:
                        `Insufficient Stock for Product ${item.product_id}`
                    });
                }

                totalAmount +=
                item.price * item.quantity;

                checkStock(index + 1);

            }
        );
    };

    const createOrderRecord = () => {

        const orderSql = `
        INSERT INTO orders
        (
            user_id,
            total_amount
        )
        VALUES (?,?)
        `;

        db.query(
            orderSql,
            [
                req.user.id,
                totalAmount
            ],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: err.message
                    });
                }

                const orderId =
                result.insertId;

                let processed = 0;

                products.forEach(item => {

                    const itemSql = `
                    INSERT INTO order_items
                    (
                        order_id,
                        product_id,
                        quantity,
                        price
                    )
                    VALUES (?,?,?,?)
                    `;

                    db.query(
                        itemSql,
                        [
                            orderId,
                            item.product_id,
                            item.quantity,
                            item.price
                        ]
                    );

                    db.query(
                        `
                        UPDATE products
                        SET stock_quantity =
                        stock_quantity - ?
                        WHERE id = ?
                        `,
                        [
                            item.quantity,
                            item.product_id
                        ]
                    );

                    processed++;

                    if (
                        processed ===
                        products.length
                    ) {

                        res.status(201).json({
                            message:
                            "Order Created Successfully",
                            orderId
                        });

                    }

                });

            }
        );

    };

    checkStock();

};

const updateOrderStatus = (req,res)=>{

    const { id } = req.params;

    const { status } = req.body;

    const sql = `
    UPDATE orders
    SET status = ?
    WHERE id = ?
    `;

    db.query(
        sql,
        [status,id],
        (err,result)=>{

            if(err){
                return res.status(500).json({
                    message:err.message
                });
            }

            res.status(200).json({
                message:"Order Status Updated"
            });

        }
    );

};

const cancelOrder = (req, res) => {

    const { id } = req.params;

    const orderSql = `
    SELECT *
    FROM orders
    WHERE id = ?
    `;

    db.query(
        orderSql,
        [id],
        (err, orderResult) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (orderResult.length === 0) {
                return res.status(404).json({
                    message: "Order Not Found"
                });
            }

            const order =
            orderResult[0];

            if (
                order.status ===
                "Cancelled"
            ) {
                return res.status(400).json({
                    message:
                    "Order Already Cancelled"
                });
            }

            const itemSql = `
            SELECT *
            FROM order_items
            WHERE order_id = ?
            `;

            db.query(
                itemSql,
                [id],
                (err, items) => {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    items.forEach(item => {

                        db.query(
                            `
                            UPDATE products
                            SET stock_quantity =
                            stock_quantity + ?
                            WHERE id = ?
                            `,
                            [
                                item.quantity,
                                item.product_id
                            ]
                        );

                    });

                    db.query(
                        `
                        UPDATE orders
                        SET status='Cancelled'
                        WHERE id=?
                        `,
                        [id]
                    );

                    res.status(200).json({
                        message:
                        "Order Cancelled & Stock Restored"
                    });

                }
            );

        }
    );

};

const getOrders = (req,res)=>{

    db.query(
        "SELECT * FROM orders",
        (err,results)=>{

            if(err){
                return res.status(500).json({
                    message:err.message
                });
            }

            res.json(results);

        }
    );

};

module.exports = {
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getOrders
};
