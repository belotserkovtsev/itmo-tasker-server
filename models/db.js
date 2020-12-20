global.mysql = require('mysql');

global.pool = global.mysql.createPool({
    host: process.env.host,
    database: process.env.db,
    user: process.env.user,
    password: process.env.password,
    multipleStatements: true
});

const User = require('./user')
const Group = require('./group')
const Task = require('./task')

class Db {

    static async checkUser(username, id=null) {
        return await User.check(username, id)
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

    static async setTaskDone(userId, taskId) {
        return await Task.setDone(userId, taskId)
    }

    static async getHeadGroupTasks(userId) {
        return await Task.getHeadGroupTasks(userId)
    }

    static async getHeadUserTasks(userId) {
        return await Task.getHeadUserTasks(userId)
    }

    static async create(userId, title, description, task, group, name=null, studentId=null) {
        if(!name && !studentId && group) {
            // console.log(userId, title, description, task, group)
            return await Task.createGroupTask(userId, title, description, task, group)
        } else {
            return await Task.createUserTask(userId, title, description, task, name, studentId)
        }

    }
}

module.exports = Db