import {
  GET_RECORDS,
  ADD_RECORD,
  DOWNLOAD_RECORD,
  RECORDS_LOADING,
  ADD_STUDENT_COMMENT,
} from '../actions/types';

const initialState = {
  records: [],
  loading: false,
};

export default function recordsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_RECORDS:
      return { ...state, records: action.payload, loading: false };
    case DOWNLOAD_RECORD:
      return { ...state, records: state.records.filter(r => r._id !== action.payload) };
    case ADD_RECORD:
      return { ...state, records: [action.payload, ...state.records] };
    case ADD_STUDENT_COMMENT:
      return { ...state, records: [action.payload, ...state.records] };
    case RECORDS_LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
}
