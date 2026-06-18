const db = require("../config/db");

const logAction = (
    userId,
    action,
    description
) => {

    const sql = `
    INSERT INTO audit_logs
    (
        user_id,
        action,
        description
    )
    VALUES(?,?,?)
    `;

    db.query(
        sql,
        [
            userId,
            action,
            description
        ],
        (err) => {

            if(err){
                console.log("Audit Log Error:");
                console.log(err);
            }

        }
    );

};

module.exports = logAction;