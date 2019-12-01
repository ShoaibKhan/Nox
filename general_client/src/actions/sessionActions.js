import axios from 'axios';
import { GET_SESSIONS, ADD_SESSION, DOWNLOAD_SESSION, SESSIONS_LOADING } from './types';

export const getSessions = (pid) => dispatch => {
    dispatch(setSessionsLoading());
    axios.get("http://localhost:5000/api/sessions", {
        body: {
            pid: pid
        }
    })
}

export const downloadSession = (sesid) => dispatch => {
    axios.download(`/api/sessions/${sesid}`).then(res =>
        dispatch({
            type: DOWNLOAD_SESSION,
            payload: sesid
        }))
}

export const addSession = (Session) => dispatch => {
    axios
        .post('sessions', Session, { baseURL: "http://localhost:5000/api/" })
        .then(res => {
            console.log(`Received response from server: ${{ res }}`)
            dispatch({
                type: ADD_SESSION,
                payload: res.data
            })
        })
}

export const setSessionsLoading = () => {
    return {
        type: SESSIONS_LOADING
    };
}

