import axios from 'axios'
import io from 'socket.io-client'

const socket = io('ws://localhost:9093')

// 获取聊天列表
const MSG_LIST = 'MSG_LIST'
// 读取信息
const MSG_RECV = 'MSG_RECV'
// 标识已读
const MSG_READ = 'MSG_READ'

const initState = {
    chatmsg: [],
    users: {},
    // 总共未读消息数量
    unread: 0
}

export function chat (state = initState, action) {
    switch (action.type) {
        case MSG_LIST:
            return {
                ...state,
                users: action.playload.users,
                chatmsg: action.playload.msgs,
                unread: action.playload.msgs.filter(v => !v.read && v.to === action.playload.userId).length
            }
        case MSG_RECV:
            const n = action.playload.to === action.userId ? 1 : 0
            return { ...state, chatmsg: [...state.chatmsg, action.playload], unread: state.unread + n }
        case MSG_READ:
            const { from, num } = action.playload
            return {
                ...state,
                chatmsg: state.chatmsg.map(v => ({ ...v, read: from === v.from })),
                unread: state.unread - num
            }
        default:
            return state
    }
}

function msgList (msgs, users, userId) {
    return { type: MSG_LIST, playload: { msgs, users, userId } }
}

function msgRecv (msg, userId) {
    return { userId, type: MSG_RECV, playload: msg }
}

function msgRead ({ from, userId, num }) {
    return { type: MSG_READ, playload: { from, userId, num } }
}

export function readMsg (from) {
    return (dispatch, getState) => {
        axios.post('/user/readMsg', { from })
            .then(res => {
                const userId = getState().user._id
                if (res.status === 200 && res.data.code === 0) {
                    dispatch(msgRead({ num: res.data.num, from, userId }))
                }
            })
    }
}

// 读取信息
export function recvMsg () {
    return (dispatch, getState) => {
        socket.on('recvmsg', function (data) {
            const userId = getState().user._id
            console.log('recvmsg', data)
            dispatch(msgRecv(data, userId))
        })
    }
}

// 发送信息
export function sendMsg ({ from, to, msg }) {
    return dispatch => {
        socket.emit('sendmsg', { from, to, msg })
    }
}

export function getMsgList () {
    return (dispatch, getState) => {
        axios.get('/user/getMsgList')
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    const userId = getState().user._id
                    dispatch(msgList(res.data.msgs, res.data.users, userId))
                }
            })
    }
}