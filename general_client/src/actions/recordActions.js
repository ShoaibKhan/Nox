import axios from 'axios';
import { GET_RECORDS, ADD_RECORDS, DOWNLOAD_RECORDS, RECORDS_LOADING } from '../actions/types'

export const getRecords = () => dispatch => {
    dispatch(setRecordsLoading());
    axios.get('/api/records')
    .then(res => dispatch({
        type: GET_RECORDS,
        payload: res.data
    }))
}

export const downloadSession = (Record) => dispatch => {
    axios.download(`/api/records/${Record}`).then(res =>
        dispatch({
            type: DOWNLOAD_RECORDS,
            payload: Record
        }))
}

export const addRecord = (Record) => dispatch => {
    axios
        .post('records', Record, { baseURL: "http://localhost:5000/api/"})
        .then(res => {
            dispatch({
                type: ADD_RECORDS,
                payload: res.data
            })
        })
}

export const setRecordsLoading = () => {
    return {
        type: RECORDS_LOADING
    };
}

