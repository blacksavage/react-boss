import React from 'react'
import { connect } from 'react-redux'
import { Result, List, WhiteSpace, Modal } from 'antd-mobile'
import browserCookie from 'browser-cookies'
import { logoutSubmit } from '../../redux/user.redux'
import {Redirect} from 'react-router-dom'

@connect(
    state => state.user,
    { logoutSubmit }
)
class User extends React.Component {
    render () {
        const props = this.props
        return props.user ? (
            <div>
                <Result
                    img={<img src={require(`../img/${props.avatar}.png`)} style={{ width: 50 }}/>}
                    title={props.user}
                    message={props.type === 'boss' ? props.company : null}
                />
                <List renderHeader={() => '简介'}>
                    <List.Item
                        multipleLine
                    >
                        {props.title}
                        {props.desc.split('\n').map(v => <List.Item.Brief key={v}>{v}</List.Item.Brief>)}
                        {props.money ? <List.Item.Brief>薪资：{props.money}</List.Item.Brief> : null}
                    </List.Item>
                </List>
                <WhiteSpace/>
                <List>
                    <List.Item onClick={this.logout.bind(this)}>退出登录</List.Item>
                </List>
            </div>
        ) : <Redirect to={props.redirectTo}/>
    }

    logout () {
        const alert = Modal.alert
        alert('注销', '确定退出登录吗？', [
            { text: '取消', onPress: () => null },
            {
                text: '确认', onPress: () => {
                    browserCookie.erase('userId')
                    this.props.logoutSubmit()
                }
            }
        ])
    }
}

export default User