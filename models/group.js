const Exception = require('../exceptions/exception')

class Group {
    static getUserGroups(userId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                connection.query('select g.name, g.id from user_group ' +
                    'inner join \`groups\` g on g.id = user_group.group_id ' +
                    'where user_group.user_id = ?', [userId], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    return resolve(rows);

                })
            })
        })
    }
}

module.exports = Group