import axios from "../axios"

const handleLoginApi = (email, password) => {
    return axios.post('/api/login', {email, password})
}

const getAllUserService = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    // return axios.delete('api/delete-user', {id: userId})
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    })
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData)
}

const getAllCode = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

export {handleLoginApi, getAllUserService, createNewUserService, deleteUserService, editUserService, getAllCode}