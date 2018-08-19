import React from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'

@connect(
    state => state
)
class Msg extends React.Component {
    render () {
        if (!this.props.chat.chatmsg.length) {
            return null
        }
        const userId = this.props.user._id
        const msgGroup = {}
        this.props.chat.chatmsg.forEach(v => {
            msgGroup[v.chatid] = msgGroup[v.chatid] || []
            msgGroup[v.chatid].push(v)
        })
        const chatList = Object.values(msgGroup).sort((a, b) => {
            console.log(a)
            console.log(b)
            const a_last = this.getLast(a).create_time
            const b_last = this.getLast(b).create_time
            return b_last - a_last
        })
        return (
            <div>
                {chatList.map(v => {
                    const lastItem = this.getLast(v)
                    const targetId = userId === lastItem.to ? lastItem.from : lastItem.to
                    const unreadNum = v.filter(n => !n.read && n.to === userId).length
                    return (
                        <List key={lastItem._id}>
                            <List.Item
                                extra={<Badge text={unreadNum}/>}
                                thumb={require(`../img/${this.props.chat.users[targetId].avatar}.png`)}
                                arrow='horizontal'
                                onClick={() => {
                                    this.props.history.push(`/chat/${targetId}`)
                                }}
                            >
                                {lastItem.content}
                                <List.Item.Brief>{this.props.chat.users[targetId].name}</List.Item.Brief>
                            </List.Item>
                        </List>
                    )
                })}
            </div>
        )
    }

    getLast (arr) {
        return arr[arr.length - 1]
    }
}

export default Msg