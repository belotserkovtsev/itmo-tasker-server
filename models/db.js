global.mysql = require('mysql');

global.pool = global.mysql.createPool({
    host: process.env.host,
    database: process.env.db,
    user: process.env.user,
    password: process.env.password
});

const User = require('./user')
const Group = require('./group')
const Task = require('./task')

class Db {

    static async checkUser(username) {
        return await User.check(username)
    }

    static async addUser(username) {
        return await User.add(username)
    }

    static async getUserGroups(userId) {
        return await Group.getUserGroups(userId)
    }

    static async getUserTasks(userId) {
        return await Task.getUserTasks(userId)
    }

    static async getGroupTasks(groupId, userId) {
        return groupId ? await Task.getGroupTasks(groupId, null) :
            await Task.getGroupTasks(null, userId)
    }
}

module.exports = Db