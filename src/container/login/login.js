import React from 'react'
import Logo from '../../component/logo/logo'
import { List, InputItem, WingBlank, WhiteSpace, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { login } from '../../redux/user.redux'
import imoocForm from '../../component/imooc-form/imooc-form'

@connect(
    state => state.user,
    { login }
)
@imoocForm
class Login extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div>
                {(this.props.redirectTo && this.props.redirectTo !== '/login') ?
                    <Redirect to={this.props.redirectTo}/> : null}
                <Logo></Logo>
                <WingBlank>
                    <List>
                        {this.props.msg ? <p className='error-msg'>{this.props.msg}</p> : null}
                        <InputItem
                            onChange={v => this.props.handleChange('user', v)}
                        >用户</InputItem>
                        <WhiteSpace/>
                        <InputItem
                            onChange={v => this.props.handleChange('pwd', v)}
                            type='password'
                        >密码</InputItem>
                    </List>
                    <WhiteSpace/>
                    <Button type='primary' onClick={this.handleLogin.bind(this)}>登录</Button>
                    <WhiteSpace/>
                    <Button onClick={this.register.bind(this)} type='primary'>注册</Button>
                </WingBlank>
            </div>
        )
    }

    handleLogin () {
        this.props.login(this.props.state)
    }

    register () {
        this.props.history.push('/register')
    }
}

export default Login