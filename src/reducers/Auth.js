export const SET_AUTH_TOKEN = "SET_AUTH_TOKEN";
export const SET_LOADING = "SET_LOADING";

export const setAuthToken = (token) => ({
    type: SET_AUTH_TOKEN,
    token
})

export const setLoading = (loading) => ({
    type: SET_LOADING,
    loading
})

const initialState = {
    token: "",
    loading: false
}


export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case SET_AUTH_TOKEN:
            return {
                ...state,
                token: action.token
            }
        
        case SET_LOADING:
            return {
                ...state,
                loading: action.loading
            }
    
        default:
    }
    return state
}