import React, { Component } from 'react'
import { connect } from 'react-redux'
import { postVerifyBookAppointment } from '../../services/userService'
import HomeHeader from '../HomePage/HomeHeader'
import './VerifyEmail.scss'

class VerifyEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            statusVerify: false,
            errCode: 0
        }
    }

    async componentDidMount() {
        if(this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search)
            let token = urlParams.get('token')
            let doctorId = urlParams.get('doctorId')
            let res = await postVerifyBookAppointment({
                token: token,
                doctorId: doctorId,
            })
            console.log('check res verify :::', res);

            if(res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {

        }
    }

    render() {
        let { statusVerify, errCode } = this.state

        return (
            <>
                <HomeHeader />
                
                <div>Cccc</div>
                <div className='verify-email-container'>
                    {statusVerify === false ?
                    <div>Loading data...</div> :
                    <div>
                        {+errCode === 0 ?
                            <div className='info-booking'>Xác nhận lịch hẹn thành công !</div> :
                            <div className='info-booking'>Lịch hẹn đã được xác nhận hoặc không tồn tại !</div>
                        }
                    </div>
                    }
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail)