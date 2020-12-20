const express = require('express')
const db = require('./models/db')

const app = express()
const Exception = require('./exceptions/exception')

app.get('/api/checkUser', ((req, res) => {
    if(req.query.username) {
        db.checkUser(req.query.username)
            .then(ans => {
                res.json({
                    user: ans
                })
            })
            .catch(e => {
                res.json({
                    error: e
                })
            })
    } else {
        res.json({
            error: new Exception(3, 'Incorrect request', req.query)
        })
    }

}))

app.get('/api/getUserGroups', ((req, res) => {
    if (req.query.userId && parseInt(req.query.userId)) {
        db.getUserGroups(req.query.userId)
            .then(ans => {
                res.json({
                    error: false,
                    groups: ans
                })
            })
            .catch(e => {
                res.json({
                    error: e
                })
            })
    } else {
        res.json({
            error: new Exception(3, 'Incorrect request', req.query)
        })
    }
}))

app.get('/api/getUserTasks', (req, res) => {
    if (req.query.userId && parseInt(req.query.userId)) {
        db.getUserTasks(req.query.userId)
            .then(ans => {
                res.json({
                    tasks: ans
                })
            })
    } else {
        res.json({
            error: new Exception(3, 'Incorrect request', req.query)
        })
    }
})

app.get('/api/getHeadUserTasks', (req, res) => {
    if (req.query.userId && parseInt(req.query.userId)) {
        db.getHeadUserTasks(req.query.userId)
            .then(ans => {
                res.json({
                    tasks: ans
                })
            })
    } else {
        res.json({
            error: new Exception(3, 'Incorrect request', req.query)
        })
    }
})

app.get('/api/getGroupTasks', (req, res) => {
    if (req.query.groupId && parseInt(req.query.groupId)) {
        db.getGroupTasks(req.query.groupId, null)
            .then(ans => {
                res.json({
                    tasks: ans
                })
            })
    } else if(req.query.userId && parseInt(req.query.userId)) {
        db.getGroupTasks(null, req.query.userId)
            .then(ans => {
                res.json({
                    tasks: ans
                })
            })
    } else {
        res.json({
            error: new Exception(3, 'Incorrect request', req.query)
        })
    }
})

app.get('/api/getHeadGroupTasks', (req, res) => {
    if(req.query.userId && parseInt(req.query.userId)) {
        db.getHeadGroupTasks(req.query.userId)
            .then(ans => {
                res.json({
                    tasks: ans
                })
            })
    } else {
        res.json({
            error: new Exception(3, 'Incorrect request', req.query)
        })
    }
})

app.post('/api/setTaskDone', ((req, res) => {
    if (req.query.taskId && parseInt(req.query.taskId) && req.query.userId && parseInt(req.query.userId)) {
        db.setTaskDone(req.query.userId, req.query.taskId)
            .then(_ => {
                res.sendStatus(200)
            })
    } else {
        res.status(400).json({
            error: new Exception(3, 'Incorrect request', req.query)
        })
    }
}))

app.post('/api/createTask', ((req, res) => {
    if(req.query.name && req.query.id && !req.query.group) {
        db.create(req.query.userId, req.query.title, req.query.description, req.query.task, null, req.query.name, req.query.id)
            .then(_ => {
                res.sendStatus(200)
            })
            .catch(e => {
                res.status(400).json({
                    error: e
                })
            })
    } else if (req.query.userId && req.query.title && req.query.description && req.query.task && req.query.group) {
        db.create(req.query.userId, req.query.title, req.query.description, req.query.task, req.query.group)
            .then(_ => {
                res.sendStatus(200)
            })
            .catch(e => {
                res.status(400).json({
                    error: e
                })
            })
    }

}))

app.listen(8888)