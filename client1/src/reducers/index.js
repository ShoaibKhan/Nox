import {combineReducers} from 'redux';
import itemReducer from './itemReducer.js';

export default combineReducers({
    item: itemReducer
});
