import React from 'react'
import { Card, WhiteSpace, WingBlank } from 'antd-mobile'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

@withRouter
class UserCard extends React.Component {
    static propTypes = {
        userList: PropTypes.array.isRequired
    }

    render () {
        return (
            <WingBlank>
                {this.props.userList.map(v => (
                    v.avatar
                        ? <Card key={v._id}
                                onClick={() => this.handleClick(v)}
                        >
                            <Card.Header
                                title={v.user}
                                thumb={require(`../img/${v.avatar}.png`)}
                                extra={<span>{v.title}</span>}
                            />
                            <Card.Body>
                                {v.type === 'boss' ? <div>公司:{v.company}</div> : null}
                                {v.desc.split('\n').map((d, k) => (
                                    <div key={k}>{d}</div>
                                ))}
                                {v.type === 'boss' ? <div>薪资:{v.money}</div> : null}
                            </Card.Body>
                        </Card>
                        : null
                ))}
            </WingBlank>
        )
    }

    handleClick (v) {
        this.props.history.push(`/chat/${v._id}`)
    }
}

export default UserCard