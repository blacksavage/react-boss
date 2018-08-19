import React from 'react'
import { connect } from 'react-redux'
import { getUserList } from "../../redux/chat-user.redux"
import UserCard from '../user-card/user-card'

@connect(
    state => state.chatUser,
    { getUserList }
)
class Boss extends React.Component {
    render () {
        return <UserCard userList={this.props.userList}/>
    }

    componentDidMount () {
        this.props.getUserList('boss')
    }
}

export default Boss