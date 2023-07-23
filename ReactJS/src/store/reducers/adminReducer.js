import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    positions: [],
    isLoading: true,
    users: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            let copyState = {...state}
            copyState.isLoading = true
            return {
                ...copyState
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data
            state.isLoading = false
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.genders = []
            state.isLoading = false
            return {
                ...state
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_POSITION_FAILED:
            state.positions = []
            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = []
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.users
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = []
            return {
                ...state
            }
        default:
            return state;
    }
}

export default adminReducer;