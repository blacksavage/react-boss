const express = require('express')
const utils = require('utility')
const Router = express.Router()
const model = require('./model')
const User = model.getModel('user')
const Chat = model.getModel('chat')

const _filter = { pwd: 0, __v: 0 }

Router.get('/info', function (req, res) {
    const { userId } = req.cookies
    if (!userId) {
        return res.json({ code: 1 })
    }
    User.findOne({ _id: userId }, _filter, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '服务器异常' })
        }
        return res.json({ code: 0, data: doc })
    })
})

Router.get('/getMsgList', function (req, res) {
    // Chat.remove({},function(e,d){})
    const { userId } = req.cookies
    User.find({}, function (e, userDoc) {
        let users = {}
        userDoc.forEach(v => {
            users[v._id] = { name: v.user, avatar: v.avatar }
        })
        Chat.find({ '$or': [{ from: userId }, { to: userId }] }, function (err, msgs) {
            if (!err) {
                return res.json({ code: 0, msgs, users })
            }
        })
    })
})

Router.post('/readMsg', function (req, res) {
    const { userId } = req.cookies
    const { from } = req.body
    console.log(userId, from)
    Chat.update(
        { from, to: userId },
        { '$set': { read: true } },
        { 'multi': true },
        function (e, d) {
            if (!e) {
                return res.json({code: 0, num: d.nModified})
            }
            return res.json({code: 1, msg: '修改失败'})
        }
    )
})

Router.post('/update', function (req, res) {
    const { userId } = req.cookies
    if (!userId) {
        return res.json({ code: 1 })
    }
    const body = req.body
    User.findByIdAndUpdate(userId, body, function (err, doc) {
        const data = Object.assign({}, {
            user: doc.user,
            type: doc.type
        }, body)
        return res.json({ code: 0, data })
    })
})

Router.get('/list', function (req, res) {
    const { type } = req.query
    // User.remove({},function(e,d){})
    User.find({ type }, function (err, doc) {
        return res.json({ code: 0, data: doc })
    })
})

Router.post('/login', function (req, res) {
    const { user, pwd } = req.body
    User.findOne({ user, pwd: md5Pwd(pwd) }, _filter, function (err, doc) {
        if (!doc) {
            return res.json({ code: 1, msg: '用户名或密码错误' })
        }
        res.cookie('userId', doc._id)
        return res.json({ code: 0, data: doc })
    })
})

Router.post('/register', function (req, res) {
    const { user, pwd, type } = req.body
    User.findOne({ user }, function (err, doc) {
        if (doc) {
            return res.json({ code: 1, msg: '用户名重复' })
        }

        const userModel = new User({ user, type, pwd: md5Pwd(pwd) })
        userModel.save(function (e, d) {
            if (e) {
                return res.json({ code: 1, msg: '服务器异常' })
            }
            const { user, type, _id } = d
            res.cookie('userId', _id)
            return res.json({ code: 0, data: { user, type, _id } })
        })
    })
})

function md5Pwd (pwd) {
    const salt = '#!@$&^wqeqw%*)$#%df'
    return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router