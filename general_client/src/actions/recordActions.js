import axios from 'axios';
import { GET_RECORDS, ADD_RECORD, DOWNLOAD_RECORD, RECORDS_LOADING, ADD_STUDENT_COMMENT } from './types'
import { PublicURL } from '../config/constants';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
export const getRecords = () => dispatch => {
    dispatch(setRecordsLoading());
    axios.get('records', { baseURL: PublicURL + ':5001/nox/api/' })
        .then(res => dispatch({
            type: GET_RECORDS,
            payload: res.data
        }))
}

export const downloadSession = record => dispatch => {
    axios.download('records', { baseURL: PublicURL + ':5001/nox/api/' })
        .then(res => dispatch({
            type: DOWNLOAD_RECORD,
            payload: res.record
        }))
}

export const addRecord = (record) => dispatch => {
    axios
        .post('records', record, { baseURL: PublicURL + ':5001/nox/api/' })
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
        .post('records', record, { baseURL: PublicURL + ':5001/nox/api/' })
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

