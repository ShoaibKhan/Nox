import axios from 'axios';
import { GET_RECORDS, ADD_RECORD, DOWNLOAD_RECORD, RECORDS_LOADING, ADD_STUDENT_COMMENT } from './types'

export const getRecords = () => dispatch => {
    dispatch(setRecordsLoading());
    axios.get('records', { baseURL: "http://loaclhost:5000/api/" })
        .then(res => dispatch({
            type: GET_RECORDS,
            payload: res.data
        }))
}

export const downloadSession = record => dispatch => {
    axios.download('records', { baseURL: "http://loaclhost:5000/api/" })
        .then(res => dispatch({
            type: DOWNLOAD_RECORD,
            payload: res.record
        }))
}

export const addRecord = (record) => dispatch => {
    axios
        .post('records', record, { baseURL: "http://loaclhost:5000/api/" })
        .then(res =>
            dispatch({
                type: ADD_RECORD,
                payload: res.data
            })
        )
        .catch(err =>
            console.log(err)
        );
};

export const addCommentRecord = (record) => dispatch => {

    axios
        .post('records', record, { baseURL: "http://loaclhost:5000/api/" })
        .then(res =>

            dispatch({
                type: ADD_STUDENT_COMMENT,
                payload: res.data
            })
        )
        .catch(err =>
            console.log(err)
        );
};


export const setRecordsLoading = () => {
    return {
        type: RECORDS_LOADING
    };
}

