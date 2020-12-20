const Exception = require('../exceptions/exception')

class Task {
    static getUserTasks(userId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                connection.query('select tasks.id, tasks.title, tasks.description, tasks.task, tasks.name, ' +
                    '(select count(*) from user_task_done where task_id = tasks.id and user_id = ?) done ' +
                    'from tasks ' +
                    'join user_task ut on tasks.id = ut.task_id where ut.user_id = ?', [userId, userId], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    rows.forEach(i => {
                        i.done = i.done === 1;
                    })

                    return resolve(rows);

                })
            })
        })
    }

    static getHeadUserTasks(userId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                connection.query('select t.id, t.title, t.description, t.name, ' +
                    'u.firstname, u.lastname, u.academic_group, t.task, ' +
                    '(select count(*) from user_task_done where task_id = t.id) done ' +
                    'from tasks t ' +
                    'join user_task u_t on u_t.task_id = t.id ' +
                    'join users u on u.id = u_t.user_id ' +
                    'where u_t.owner = ?', [userId], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    for(let i = 0; i < rows.length; ++i) {
                        rows[i] = {
                            id: rows[i].id,
                            title: rows[i].title,
                            description: rows[i].description,
                            task: rows[i].task,
                            name: rows[i].academic_group
                                + " - "
                                + rows[i].firstname + " "
                                + rows[i].lastname
                                + ". "
                                + rows[i].name,
                            done: rows[i].done === 1
                        }
                    }

                    return resolve(rows);

                })
            })
        })
    }

    static getGroupTasks(groupId, userId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                let sqlRequest = groupId ? 'select tasks.id, tasks.title, tasks.description, tasks.task' +
                    'from tasks inner join group_task gt on tasks.id = gt.task_id ' +
                    'where gt.group_id = ?' :
                    'select tasks.id, tasks.title, tasks.description, tasks.task, g.name, ' +
                    '(select count(*) from user_task_done where task_id = tasks.id and user_id = ?) done ' +
                    'from tasks ' +
                    'join group_task gt on tasks.id = gt.task_id join `groups` g on g.id = gt.group_id ' +
                    'where gt.group_id in ' +
                    '(select g.id from user_group ' +
                    'join `groups` g on g.id = user_group.group_id where user_group.user_id = ?)'

                connection.query(sqlRequest, [groupId ? groupId : userId, userId], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }
                    // rows./
                    rows.forEach(i => {
                        i.done = i.done === 1;
                    })

                    return resolve(rows);


                })
            })
        })
    }

    static getHeadGroupTasks(userId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                let sqlRequest = 'select t.id, t.title, t.description, t.task, g.name from tasks t ' +
                    'join group_task g_t on t.id = g_t.task_id ' +
                    'join `groups` g on g.id = g_t.group_id ' +
                    'where g.owner = ?'

                connection.query(sqlRequest, [userId], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    return resolve(rows);


                })
            })
        })
    }

    static setDone(userId, taskId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                connection.query('insert into user_task_done values (?, ?)', [userId, taskId], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    return resolve();

                })
            })
        })
    }

    static getGroupId(name) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }

                let sqlRequest = "select id from `groups` where name = ?"

                connection.query(sqlRequest, [name], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }
                    // console.log(rows)
                    return resolve(rows[0]);


                })
            })
        })
    }

    static isAbleToCreateTask(userId, group) {
        return new Promise((resolve, reject) => {
            this.getGroupId(group)
                .then(res => {
                    if(!res) {
                        return resolve(false)
                    }
                    pool.getConnection((err, connection) => {
                        if(err){
                            connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                            return reject(new Exception(1, err.message))
                        }
                        let sqlRequest = "select owner from `groups` where id = ?"
                        connection.query(sqlRequest, [res.id], (err, rows) => {
                            pool._freeConnections.indexOf(connection) === -1 && connection.release()

                            if(err){
                                return reject(new Exception(2, err.message))
                            }
                            // console.log(rows[0].owner, userId)
                            if(parseInt(rows[0].owner) === parseInt(userId))
                                return resolve(true)
                            else
                                return resolve(false)


                        })
                    })
                })
                .catch(e => {
                    reject(e)
                })
        })

    }

    static createUserTask(userId, title, description, task, name, studentId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }

                connection.query("insert into tasks (title, description, name, task) " +
                    "values (?, ?, ?, ?); " +
                    "SELECT LAST_INSERT_ID() id",
                    [title, description, name, task], (err, rows) => {
                        pool._freeConnections.indexOf(connection) === -1 && connection.release()
                        // console.log(title, description, name, task)
                        if(err){
                            return reject(new Exception(2, err.message))
                        }

                        let idOfTask = rows[1][0].id

                        connection.query('insert into user_task values (?, ?, ?)',
                            [studentId, idOfTask, userId], (err, rows) => {
                                pool._freeConnections.indexOf(connection) === -1 && connection.release()

                                if(err){
                                    return reject(new Exception(2, err.message))
                                }

                                return resolve();

                            })
                    })

            })

        })
    }

    static createGroupTask(userId, title, description, task, group) {
        return new Promise((resolve, reject) => {
            // console.log("here")
            this.isAbleToCreateTask(userId, group)
                .then(ans => {
                    if(ans !== true) {
                        return reject(new Exception(8, "Not your group or it doesn't exist"))
                    }
                    // console.log("here")
                    pool.getConnection((err, connection) => {
                        if(err){
                            connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                            return reject(new Exception(1, err.message))
                        }
                        connection.query("insert into tasks (title, description, name, task) " +
                            "values (?, ?, ?, ?); " +
                            "SELECT LAST_INSERT_ID() id",
                            [title, description, null, task], (err, rows) => {
                                pool._freeConnections.indexOf(connection) === -1 && connection.release()
                                // console.log(title, description, name, task)
                                if(err){
                                    return reject(new Exception(2, err.message))
                                }

                                let idOfTask = rows[1][0].id
                                // console.log(idOfTask)

                                this.getGroupId(group)
                                    .then(ans => {
                                        connection.query('insert into group_task values (?, ?)',
                                            [ans.id, idOfTask], (err, rows) => {
                                                pool._freeConnections.indexOf(connection) === -1 && connection.release()

                                                if(err){
                                                    return reject(new Exception(2, err.message))
                                                }

                                                return resolve();

                                            })
                                    })


                            })
                    })
                })
                .catch(e => {
                    reject(e)
                })
        })
    }
}

module.exports = Task