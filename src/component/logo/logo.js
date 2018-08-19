import React from 'react'
import logoImg from './job.png'
import './logo.css'

class Logo extends React.Component {
    render () {
        return (
            <div className='logo-container'>
                <img src={logoImg} atl=""/>
            </div>
        )
    }
}

export default Logo