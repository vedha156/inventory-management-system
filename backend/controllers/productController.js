const db = require("../config/db");

const logAction =
require("../utils/auditLogger");

const createProduct = (req,res)=>{

    const {
        name,
        sku,
        category,
        price,
        stock_quantity,
        low_stock_limit,
        status
    } = req.body;

    const sql = `
    INSERT INTO products
    (
      name,
      sku,
      category,
      price,
      stock_quantity,
      low_stock_limit,
      status
    )
    VALUES(?,?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            name,
            sku,
            category,
            price,
            stock_quantity,
            low_stock_limit,
            status
        ],
        (err,result)=>{

            if(err){
                return res.status(500).json({
                    message:err.message
                });
            }
            console.log("User Data:", req.user);

            logAction(
                req.user.id,
                "CREATE_PRODUCT",
                `${name} product created`
            );

            console.log("Audit Log Function Called");

            res.status(201).json({
                message:"Product Created"
            });

        }
    );

};
const getProducts = (req, res) => {

    const {
        search,
        category,
        page = 1,
        limit = 5,
        sort = "id"
    } = req.query;

    let sql =
    "SELECT * FROM products WHERE 1=1";

    let values = [];

    if (search) {

        sql +=
        " AND name LIKE ?";

        values.push(`%${search}%`);
    }

    if (category) {

        sql +=
        " AND category = ?";

        values.push(category);
    }

    sql +=
    ` ORDER BY ${sort} ASC`;

    const offset =
    (page - 1) * limit;

    sql +=
    " LIMIT ? OFFSET ?";

    values.push(
        Number(limit),
        Number(offset)
    );

    db.query(
        sql,
        values,
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json(results);

        }
    );

};

const updateProduct = (req, res) => {

    const { id } = req.params;

    const {
        name,
        sku,
        category,
        price,
        stock_quantity,
        low_stock_limit,
        status
    } = req.body;

    const sql = `
    UPDATE products
    SET
        name=?,
        sku=?,
        category=?,
        price=?,
        stock_quantity=?,
        low_stock_limit=?,
        status=?
    WHERE id=?
    `;

    db.query(
        sql,
        [
            name,
            sku,
            category,
            price,
            stock_quantity,
            low_stock_limit,
            status,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }
            logAction(
                req.user.id,
                "UPDATE_PRODUCT",
                `Product ${id} updated`
            );

            res.status(200).json({
                message: "Product Updated Successfully"
            });

        }
    );

};

const deleteProduct = (req, res) => {

    const { id } = req.params;

    const sql =
    "DELETE FROM products WHERE id=?";

    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }
            logAction(
                req.user.id,
                "DELETE_PRODUCT",
                `Product ${id} deleted`
            );

            res.status(200).json({
                message: "Product Deleted Successfully"
            });

        }
    );

};


const getLowStockProducts = (req,res)=>{

    const sql = `
    SELECT *
    FROM products
    WHERE stock_quantity <= low_stock_limit
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
    createProduct,
    getProducts,
    updateProduct,
    getAuditLogs,
    getLowStockProducts,
    deleteProduct
};