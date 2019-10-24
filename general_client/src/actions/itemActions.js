import axios from 'axios';
import { GET_ITEMS, ADD_ITEM, DOWNLOAD_ITEM, ITEMS_LOADING } from './types'

export const getItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios.get('/api/items').then(res => dispatch({
        type: GET_ITEMS,
        payload: res.data
    }))
}

export const downloadItem = (id) => dispatch => {
    axios.download(`/api/items/${id}`).then(res =>
        dispatch({
            type: DOWNLOAD_ITEM,
            payload: id
        }))
}

export const addItem = (item) => dispatch => {
    axios
        .post('/api/items', item)
        .then(res => dispatch({
            type: ADD_ITEM,
            payload: res.data
        }))
}

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    };
}

