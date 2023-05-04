export const SET_AUTH_TOKEN = "SET_AUTH_TOKEN";

export const setAuthToken = (token) => ({
    type: SET_AUTH_TOKEN,
    token
})

const initialState = {
    token: ""
}


export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case SET_AUTH_TOKEN:
            return {
                ...state,
                token: action.token
            }
    
        default:
            break;
    }
}