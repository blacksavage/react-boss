import { combineReducers } from 'redux'
import { user } from './redux/user.redux'
import { chatUser } from './redux/chat-user.redux'
import { chat } from './redux/chat.redux'

export default combineReducers({
    user,
    chatUser,
    chat
})