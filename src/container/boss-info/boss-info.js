import React from 'react'
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import AvatarSelector from '../../component/avatar-selector/avatar-selector'
import { connect } from 'react-redux'
import { update } from '../../redux/user.redux'
import { Redirect } from 'react-router-dom'

@connect(
    state => state.user,
    { update }
)
class BossInfo extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            avatar: '',
            title: '',
            company: '',
            money: '',
            desc: ''
        }
    }

    render () {
        const path = this.props.location.pathname
        // const path = '312'
        const redirect = this.props.redirectTo
        return (
            <div>
                {redirect && redirect !== path ? <Redirect to={redirect}/> : null}
                <NavBar mode='dark'>信息完善</NavBar>
                <AvatarSelector avatarSelector={v => {
                    this.setState({
                        avatar: v
                    })
                }}/>
                <InputItem
                    onChange={v => this.handleChange('title', v)}
                >招聘职位</InputItem>
                <InputItem
                    onChange={v => this.handleChange('company', v)}
                >公司名称</InputItem>
                <InputItem
                    onChange={v => this.handleChange('money', v)}
                >薪资范围</InputItem>
                <TextareaItem
                    onChange={v => this.handleChange('desc', v)}
                    rows={3}
                    autoHeight
                    title='职位要求'
                />
                <Button
                    type='primary'
                    onClick={() => this.props.update(this.state)}
                >保存</Button>
            </div>
        )
    }

    handleChange (key, val) {
        this.setState({
            [key]: val
        })
    }
}

export default BossInfo