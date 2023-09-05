import React, { Component } from 'react'
import { connect } from 'react-redux'
import './ManageSchedule.scss'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select'
import * as actions from "../../../store/actions"
import { LANGUAGES, DATEFORMAT } from "../../../utils"
import DatePicker from "../../../components/Input/DatePicker"
import { toast } from 'react-toastify'
import _ from 'lodash'
import moment from 'moment'
import { saveBulkScheduleDoctor, getRangtimeByDoctorAndDate } from '../../../services/userService'

class ManageSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
            rangeTimeForSelect: []
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctors()
        this.props.fetchAllScheduleTime()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }

        if(prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime
            if(data && data.length > 0) {
                data = data.map(item => ({...item, isSelected: false}))
            }

            this.setState({
                rangeTime: data
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        if(inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {}
                let labelVi = `${item.lastName} ${item.firstName}`
                let labelEn = `${item.firstName} ${item.lastName}`
                object.label = this.props.language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.id
                result.push(object)
            })
        }
        return result
    }

    handleChangeSelect = async (selectedOption) => {
        this.state.rangeTime.map(x => x.isSelected = false)
        if(this.state.currentDate) {
            let data = await getRangtimeByDoctorAndDate(+selectedOption.value, this.state.currentDate.getTime())
            console.log('hehe check', data);
        }
        this.setState({
            selectedDoctor: selectedOption
        })
    }

    handleOnChangeDatePicker = async (date) => {
        this.state.rangeTime.map(x => x.isSelected = false)
        if(this.state.selectedDoctor) {
            let data = await getRangtimeByDoctorAndDate(+this.state.selectedDoctor.value, date[0].getTime())
            console.log('hehe check data.data:', data.data);
            let all = data.data.map(x => x.timeType)
            let rs = this.state.rangeTime.map(x => {
                if(all.includes(x.keymap)) {
                    x.isSelected = true
                }
                return x
            });
            console.log('data update:', rs);
        }
        this.setState({
            currentDate: date[0]
        })
    }

    handleClickBtnTime = (time) => {
        console.log('>>handle click btn time:', time);
        let {rangeTime} = this.state
        if(rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if(item.id === time.id) item.isSelected = !item.isSelected
                return item
            })

            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let {rangeTime, selectedDoctor, currentDate} = this.state
        let result = []

        if(selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Invalid selected doctor !")
            return
        }
        if(!currentDate) {
            toast.error("Invalid date !")
            return
        }

        // let formattedDate = moment(currentDate).format(DATEFORMAT.SEND_TO_SERVER)

        let formattedDate = new Date(currentDate).getTime()

        if(rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true)
            if(selectedTime && selectedTime.length > 0) {
                selectedTime.map((schedule, index) => {
                    let object = {}
                    object.doctorId = selectedDoctor.value
                    object.date = formattedDate
                    object.timeType = schedule.keymap
                    result.push(object)
                })
            } else {
                toast.error("Invalid selected time !")
                return
            }

            let res = await saveBulkScheduleDoctor({
                arrSchedule: result,
                doctorId: selectedDoctor.value,
                formattedDate: formattedDate
            })

            if(res && res.errCode === 0) {
                toast.success("Success in saving infor !")
            } else {
                toast.error("Save bulk schedule doctor error !")
                console.log("bulk schedule doctor error:", res);
            }

            console.log('>>check res saveBulkScheduleDoctor:', res);
            console.log(">> check result:", result);
        }
    }


    render() {
        let {rangeTime} = this.state
        let {language} = this.props
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))

        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="manage-schedule.choose-date" /></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button 
                                            className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                            key={index}
                                            onClick={() => this.handleClickBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button
                                className='btn btn-danger btn-save-schedule'
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctor()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime())

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule)