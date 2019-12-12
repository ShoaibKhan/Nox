import { GET_RECORDS, ADD_RECORDS, DOWNLOAD_RECORDS, RECORDS_LOADING, ADD_STUDENT_COMMENT } from '../actions/types'

const initialState = {
    records: [],
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_RECORDS:
            return {
                ...state,
                records: action.payload,
                loading: false
            };
        case DOWNLOAD_RECORDS:
            return {
                ...state,
                records: state.records.filter(record => record._id !== action.payload)
                //This is the reducer for deleting a record. Need to change to download. What to pass as payload?
            };
        case ADD_RECORDS:
            return {
                ...state,
                records: [action.payload, ...state.records]
            };
        case ADD_STUDENT_COMMENT:
            return {
                ...state,
                records: [action.payload, ...state.records]
            };
        case RECORDS_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}