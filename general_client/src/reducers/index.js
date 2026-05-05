import { combineReducers } from 'redux';
import sessionReducer from './sessionReducer.js';
import recordsReducer from './recordsReducer.js';
import pulseReducer from '../slices/pulseSlice';
import questionsReducer from '../slices/questionsSlice';
import pollReducer from '../slices/pollSlice';

export default combineReducers({
  session: sessionReducer,
  records: recordsReducer,
  pulse: pulseReducer,
  questions: questionsReducer,
  poll: pollReducer,
});
