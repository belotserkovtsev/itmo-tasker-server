const Exception = require('../exceptions/exception')

class Task {
    static getUserTasks(userId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                connection.query('select tasks.id, tasks.title, tasks.description ' +
                    'from tasks ' +
                    'inner join user_task ut on tasks.id = ut.task_id ' +
                    'where ut.user_id = ?', [userId], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    return resolve(rows);

                })
            })
        })
    }

    static getGroupTasks(groupId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                connection.query('select tasks.id, tasks.title, tasks.description ' +
                    'from tasks inner join group_task gt on tasks.id = gt.task_id ' +
                    'where gt.group_id = ?', [groupId], (err, rows) => {
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

module.exports = Task