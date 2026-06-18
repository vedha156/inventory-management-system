const db = require("../config/db");
const bcrypt = require("bcryptjs");
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword =
            await bcrypt.hash(password, 10);
        const sql =
            `INSERT INTO users
            (name,email,password,role)
            VALUES(?,?,?,?)`;
        db.query(
            sql,
            [name, email, hashedPassword, role],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message
                    });
                }
                res.status(201).json({
                    message: "User Registered Successfully"
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const jwt = require("jsonwebtoken");

const login = (req, res) => {

    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        const user = result[0];

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
            role: user.role
        });

    });

};
module.exports = {
    register,
    login
};