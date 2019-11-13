import { GET_SESSIONS, ADD_SESSION, DOWNLOAD_SESSION, SESSIONS_LOADING } from '../actions/types'

const initialState = {
    sessions: [],
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_SESSIONS:
            return {
                ...state,
                sessions: action.payload,
                loading: false
            };
        case DOWNLOAD_SESSION:
            return {
                ...state,
                sessions: state.sessions.filter(item => item._id !== action.payload)
            };
        case ADD_SESSION:
            return {
                ...state,
                sessions: [action.payload, ...state.sessions]
            };
        case SESSIONS_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}