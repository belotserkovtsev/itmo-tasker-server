const Exception = require('../exceptions/exception')

class User {
    static check(username) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                connection.query(`select * from users where username = ?`, [username], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    if(!rows.length)
                        return resolve(false)

                    return resolve(true);

                })
            })
        })
    }

    static add(username){
        return new Promise((resolve, reject) => {
            pool.getConnection(async (err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message));
                }
                connection.query('insert into users (username, type) values (?, true)', [username], (err, rows) => {
                    connection.release();

                    if(err){
                        return reject(new Exception(2, err.message));
                    }

                    return resolve(rows);

                })
            })
        })
    }
}

module.exports = User