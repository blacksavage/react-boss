import React from 'react'
import { List, InputItem, NavBar, Icon, Grid } from 'antd-mobile'
import { connect } from 'react-redux'
import { getMsgList, sendMsg, recvMsg, readMsg } from '../../redux/chat.redux'
import { getChatId } from '../../util'

@connect(
    state => state,
    { getMsgList, sendMsg, recvMsg, readMsg }
)
class Chat extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            text: ''
        }
    }

    render () {
        const emoji = '😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😀 😁 🤣 😂 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴 😴'
            .split(' ').filter(v => v).map(v => ({ text: v }))
        const userId = this.props.match.params.user
        const users = this.props.chat.users
        if (!users[userId]) {
            return null
        }
        const chatId = getChatId(userId, this.props.user._id)
        const chatMsg = this.props.chat.chatmsg.filter(v => v.chatid === chatId)
        return (
            <div id='chat-page'>
                <NavBar mode='dark'
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {
                            this.props.history.goBack()
                        }}
                >{users[userId].name}</NavBar>
                {chatMsg.map(v => {
                    const avatar = require(`../img/${users[v.from].avatar}.png`)
                    return v.from === userId
                        ? <List key={v._id}>
                            <List.Item
                                thumb={avatar}
                            >{v.content}</List.Item>
                        </List>
                        : <List key={v._id}>
                            <List.Item
                                extra={<img src={avatar}/>}
                                className='chat-me'
                            >{v.content}</List.Item>
                        </List>
                })}
                <div className='stick-footer'>
                    <List>
                        <InputItem
                            placeholder='请输入'
                            value={this.state.text}
                            onChange={v => {
                                this.setState({ text: v })
                            }}
                            extra={
                                <div>
                                    <span
                                        style={{ marginRight: 15 }}
                                        onClick={() => {
                                            this.setState({
                                                showEmoji: !this.state.showEmoji
                                            })
                                            this.fixCarousel()
                                        }}
                                    >😴</span>
                                    <span onClick={() => this.handleSubmit()}>发送</span>
                                </div>
                            }
                        />
                    </List>
                    {
                        this.state.showEmoji
                            ? <Grid
                                data={emoji}
                                columnNum={9}
                                isCarousel={true}
                                carouselMaxRow={4}
                                onClick={el => {
                                    this.setState({
                                        text: this.state.text + el.text
                                    })
                                }}
                            />
                            : null
                    }

                </div>
            </div>
        )
    }

    componentDidMount () {
        if (!this.props.chat.chatmsg.length) {
            this.props.getMsgList()
            this.props.recvMsg()
        }
        this.fixCarousel()
    }

    componentWillUnmount () {
        this.props.readMsg(this.props.match.params.user)
    }

    handleSubmit () {
        const from = this.props.user._id
        const to = this.props.match.params.user
        const msg = this.state.text
        this.props.sendMsg({ from, to, msg })
        this.setState({
            text: '',
            showEmoji: false
        })
    }

    fixCarousel () {
        // 解决antd grid初始只有一行的bug
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'))
        }, 0)
    }
}

export default Chat