import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import './Header.scss';
import {languages, USER_ROLE} from "../../utils"
import {changeLanguageApp} from '../../store/actions'
import { FormattedMessage } from 'react-intl';
import {adminMenu, doctorMenu} from './menuApp'
import _ from 'lodash'

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menuApp: []
        }
    }

    componentDidMount() {
        let {userInfo} = this.props
        let menu = []
        if(userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId
            if(role === USER_ROLE.ADMIN) {
                menu = adminMenu
            }
            else if(role === USER_ROLE.DOCTOR) {
                menu = doctorMenu
            }
        }

        this.setState({
            menuApp: menu
        })
    }

    changeLanguage = (lang) => {
        this.props.changeLanguageAppRedux(lang)
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        console.log('>>check user info:', userInfo);
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                {/* nút logout */}
                <div className='languages'>
                    <div className='msg_welcome'><FormattedMessage id={'home-header.welcome'}/>, {userInfo && userInfo.firstName ? userInfo.firstName : ''}!</div>
                    <div className={language === languages.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => this.changeLanguage(languages.VI)}>VN</span></div>
                    <div className={language === languages.EN ? 'language-en active' : 'language-en'}><span onClick={() => this.changeLanguage(languages.EN)}>EN</span></div>
                    <div className="btn btn-logout" onClick={processLogout} title='Log out'>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
