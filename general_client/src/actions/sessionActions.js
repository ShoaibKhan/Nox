import axios from 'axios';
import { GET_SESSIONS, ADD_SESSION, ADD_COURSE, DOWNLOAD_SESSION, SESSIONS_LOADING } from './types';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const courses = [];

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

export const getCourses = (PID) => dispatch => {
    dispatch(setSessionsLoading());
    axios.get("https://csc398dev.utm.utoronto.ca:5001/nox/api/sessions/FindCourse", {
        params: { pid: PID }
    })
        .then(res => dispatch({
            type: GET_SESSIONS,
            payload: res.data
        }))
}

export const getSessions = (pid, courseCode) => dispatch => {
    dispatch(setSessionsLoading());
    axios.get("https://csc398dev.utm.utoronto.ca:5001/nox/api/sessions/AllSessions", {
        params: { pid: pid, courseCode: courseCode }
    })
        .then(res => dispatch({
            type: GET_SESSIONS,
            payload: res.data
        }))
}


export const downloadSession = (sesid) => dispatch => {
    axios.download(`/api/sessions/${sesid}`).then(res =>
        dispatch({
            type: DOWNLOAD_SESSION,
            payload: sesid
        }))
}

export const addCourse = (Course) => dispatch => {
    var sesid = getRandomIntInclusive(100000, 999999);

    Course.sesid = String(sesid);
    axios.post('sessions', Course, { baseURL: "https://csc398dev.utm.utoronto.ca:5001/nox/api/" })
        .then(res => {
            console.log(`Received response from server: ${{ res }}`)
            dispatch({
                type: ADD_COURSE,
                payload: res.data
            })
            cookies.set('Prof_sesid', res.data.sesid);
            window.location = "/nox/professor/dashboard";
        })
}

export const addSession = (Session) => dispatch => {
    var sesid = getRandomIntInclusive(100000, 999999);
    Session.sesid = sesid;
    axios
        .post('sessions', Session, { baseURL: "https://csc398dev.utm.utoronto.ca:5001/nox/api/" })
        .then(res => {
            console.log(`Received response from server: ${{ res }}`)
            dispatch({
                type: ADD_SESSION,
                payload: res.data
            })
            cookies.set('Prof_sesid', res.data.sesid);
            window.location = "/nox/professor/dashboard";
        })
}

export const setSessionsLoading = () => {
    return {
        type: SESSIONS_LOADING
    };
}
