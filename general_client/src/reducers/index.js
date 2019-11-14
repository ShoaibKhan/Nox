import {combineReducers} from 'redux';
import sessionReducer from './sessionReducer.js';

export default combineReducers({
    session: sessionReducer
});
