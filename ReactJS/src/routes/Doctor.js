import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Route, Switch} from 'react-router-dom'
import ManageSchedule from '../containers/System/Doctor/ManageSchedule'
import Header from '../containers/Header/Header'

class Doctor extends Component {
    render() {
        const {isLoggedIn} = this.props
        return (
            <>
                {isLoggedIn && <Header />}
                <div className='system-container'>
                    <Switch>
                        <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                    </Switch>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Doctor)