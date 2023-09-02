import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {emitter} from '../../utils/emitter'

class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        }

        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: ''
            })
        })
    }

    componentDidMount() {

    }

    toggle = () => {
        this.props.toggleFromParent()
    }

    handleOnChangeInput = (event, id) => {
        // bad code
        /* this.state[id] = event.target.value
        this.setState({
            ...this.state
        }) */

        // good code
        let copyState = {...this.state};
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, () => {
            // console.log('check good state:', this.state);
        })
    }

    checkValidInput = () => {
        let isValid = true
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address']
        for(let i = 0; i<arrInput.length; i++) {
            if(!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter:', arrInput[i]);
                break;
            }
        }
        return isValid
    }

    handleAddNewUser = () => {
        let isValid = this.checkValidInput();
        if(isValid === true) {
            this.props.createNewUser(this.state);
        }
    }

    render() {
        // console.log('check child props:', this.props);
        // console.log('check child open modal:', this.props.isOpen);
        return (
            <Modal centered size='lg' isOpen={this.props.isOpen} toggle={() => this.toggle()} className={'modal-user-container'}>
                <ModalHeader toggle={() => this.toggle()}>Create a new user</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>Email</label>
                            <input value={this.state.email} type='text' onChange={(event) => this.handleOnChangeInput(event, 'email')}/>
                        </div>
                        <div className='input-container'>
                            <label>Password</label>
                            <input value={this.state.password} type='password' onChange={(event) => this.handleOnChangeInput(event, 'password')}/>
                        </div>
                        <div className='input-container'>
                            <label>First name</label>
                            <input value={this.state.firstName} type='text' onChange={(event) => this.handleOnChangeInput(event, 'firstName')}/>
                        </div>
                        <div className='input-container'>
                            <label>Last name</label>
                            <input value={this.state.lastName} type='text' onChange={(event) => this.handleOnChangeInput(event, 'lastName')}/>
                        </div>
                        <div className='input-container max-width-input'>
                            <label>Address</label>
                            <input value={this.state.address} type='text' onChange={(event) => this.handleOnChangeInput(event, 'address')}/>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className='px-3' color="primary" onClick={() => this.handleAddNewUser()}>
                        Add new
                    </Button>{' '}
                    <Button className='px-3' color="secondary" onClick={() => this.toggle()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);