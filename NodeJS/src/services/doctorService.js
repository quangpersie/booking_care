import db from "../models/index"
require('dotenv').config()
import _ from 'lodash'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.AllCode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.AllCode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
    
            // console.log('doctors service:', users);
    
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ["password", "image"]
                }
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch(e) {
            reject(e)
        } 
    })
}

let saveInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputData.doctorId || !inputData.contentHTML
                || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedPayment
                || !inputData.selectedProvince || !inputData.note
                || !inputData.nameClinic || !inputData.addressClinic) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                // upsert to Markdown
                if(inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if(inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: {doctorId: inputData.doctorId},
                        raw: false
                    })

                    if(doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown
                        doctorMarkdown.description = inputData.description
                        doctorMarkdown.updateAt = new Date()
                        await doctorMarkdown.save()
                    }
                }

                // upsert to Doctor_Info table
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    },
                    raw: false
                })
                if(doctorInfo) {
                    doctorInfo.doctorId = inputData.doctorId
                    doctorInfo.priceId = inputData.selectedPrice
                    doctorInfo.provinceId = inputData.selectedProvince
                    doctorInfo.paymentId = inputData.selectedPayment
                    doctorInfo.nameClinic = inputData.nameClinic
                    doctorInfo.addressClinic = inputData.addressClinic
                    doctorInfo.note = inputData.note

                    await doctorInfo.save()
                } else {
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save infor doctor success"
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.AllCode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.AllCode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if(data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if(!data) data = {}

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter(s) !"
                })
            } else {
                console.log('formattedDate:', data.formattedDate);
                let schedule = data.arrSchedule
                if(schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                //get all existing data
                let existing = await db.Schedule.findAll({
                    where: {doctorId: data.doctorId, date: data.formattedDate},
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })

                /* //convert date
                if(existing && existing.length > 0) {
                    existing = existing.map(item => {
                        item.date = new Date(item.date).getTime()
                        return item
                    })
                } */
        
                //compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                })
        
                //create data
                if(toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }
        
                resolve({
                    errCode: 0,
                    errMessage: "Bulk create ok"
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.AllCode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model:db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    raw: false,
                    nest: true
                })

                if(!dataSchedule) dataSchedule = []

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getExtraInfoDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: +idInput
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.AllCode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.AllCode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.AllCode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true
                })

                if(!data) data = []
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

let getRangtimeByDoctorAndDate = (doctorId, date) => {
    // console.log(doctorId, date);
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                     doctorId: doctorId,
                     date: date
                    }
                })
                
                if(!data) data = []
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

let getProfileDoctorById = (idInput) => {
    // console.log(doctorId, date);
    return new Promise(async (resolve, reject) => {
        try {
            if(!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: idInput
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.AllCode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.AllCode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if(data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }

                if(!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveInfoDoctor: saveInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById,
    getRangtimeByDoctorAndDate: getRangtimeByDoctorAndDate,
    getProfileDoctorById: getProfileDoctorById,
}