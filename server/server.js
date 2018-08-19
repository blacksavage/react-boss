const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const userRouter = require('./user')
const model = require('./model')
const Chat = model.getModel('chat')

// 创建app
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', function (socket) {
    socket.on('sendmsg', function (data) {
        const { from, to, msg } = data
        const chatid = [from, to].sort().join('_')
        Chat.create({ chatid, from, to, content: msg }, function (err, doc) {
            io.emit('recvmsg', Object.assign({}, doc._doc))
        })
    })
})

// 解析cookie
app.use(cookieParser())
// 解析post参数
app.use(bodyParser.json())
app.use('/user', userRouter)

server.listen(9093, function () {
    console.log('start 9093')
})

