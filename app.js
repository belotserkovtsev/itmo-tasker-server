const express = require('express')
const db = require('./models/db')

const app = express()
const Exception = require('./exceptions/exception')

app.post('/api/checkUser', ((req, res) => {
    if(req.query.username) {
        db.checkUser(req.query.username)
            .then(ans => {
                res.json({
                    error: false,
                    exists: ans
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

app.post('/api/getUserGroups', ((req, res) => {
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

app.post('/api/getUserTasks', (req, res) => {
    if (req.query.userId && parseInt(req.query.userId)) {
        db.getUserTasks(req.query.userId)
            .then(ans => {
                res.json({
                    error: false,
                    tasks: ans
                })
            })
    } else {
        res.json({
            error: new Exception(3, 'Incorrect request', req.query)
        })
    }
})

app.post('/api/getGroupTasks', (req, res) => {
    if (req.query.groupId && parseInt(req.query.groupId)) {
        db.getGroupTasks(req.query.groupId)
            .then(ans => {
                res.json({
                    error: false,
                    tasks: ans
                })
            })
    } else {
        res.json({
            error: new Exception(3, 'Incorrect request', req.query)
        })
    }
})




//DEBUG

app.post('/api/addUser', ((req, res) => {
    db.addUser(req.query.username)
        .then(ans => {
            res.json({
                error: false
            })
        })
        .catch(e => {
            res.json({
                error: e.message
            })
        })
}))

app.listen(8888)