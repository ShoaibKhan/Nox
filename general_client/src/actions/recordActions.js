import axios from 'axios';
import { GET_RECORDS, ADD_RECORD, RECORDS_LOADING, ADD_STUDENT_COMMENT } from './types';
import { PublicURL } from '../config/constants';

axios.defaults.withCredentials = true;
const apiBase = PublicURL + ':5001/nox/api';

export const getRecords = (sessionID) => (dispatch) => {
  dispatch(setRecordsLoading());
  return axios
    .get(apiBase + '/records', { params: sessionID ? { sessionID } : {} })
    .then((res) => dispatch({ type: GET_RECORDS, payload: res.data }))
    .catch(() => dispatch({ type: GET_RECORDS, payload: [] }));
};

export const addRecord = (record) => (dispatch) =>
  axios
    .post(apiBase + '/records', record)
    .then((res) => dispatch({ type: ADD_RECORD, payload: res.data }))
    .catch((err) => console.log(err));

export const addCommentRecord = (record) => (dispatch) =>
  axios
    .post(apiBase + '/records', record)
    .then((res) => dispatch({ type: ADD_STUDENT_COMMENT, payload: res.data }))
    .catch((err) => console.log(err));

export const setRecordsLoading = () => ({ type: RECORDS_LOADING });
