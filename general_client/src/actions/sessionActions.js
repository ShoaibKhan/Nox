import axios from 'axios';
import { GET_SESSIONS, GET_COURSES, ADD_SESSION, ADD_COURSE, DOWNLOAD_SESSION, SESSIONS_LOADING } from './types';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const getCourses = (pid) => dispatch => {
    dispatch(setSessionsLoading());
    axios.get("http://localhost:5000/api/sessions/AllSessions", {
        params: { pid: pid }
    })
        .then(res => dispatch({
            type: GET_COURSES,
            payload: res.data
        }))
}

export const getSessions = (pid, courseCode) => dispatch => {
    dispatch(setSessionsLoading());
    axios.get("http://localhost:5000/api/sessions/AllSessions", {
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
    axios
        .post('sessions', Course, { baseURL: "http://localhost:5000/api/" })
        .then(res => {
            console.log(`Received response from server: ${{ res }}`)
            dispatch({
                type: ADD_COURSE,
                payload: res.data
            })
            cookies.set('sesid', res.data.sesid);
            window.location = "/Dashboard";
        })
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

