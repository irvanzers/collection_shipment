import axios from 'axios';
import * as ActionType from '../constants/actionType';
import AppConstant from '../constants/app';
import { clearToken, setToken, getToken } from '../utils/actionUtil';
import * as apiAction from '../actions/apiAction';
import * as FlashMessage from '../actions/flashMessage';
let headers = {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }
export const login = (data) => (dispatch) => {
    return new Promise(async(resolve, reject) => {
        dispatch(apiAction.apiRequest());
        axios.post(AppConstant.API_URL + 'login', data, headers)
        .then((response) => {
            dispatch({
                type: ActionType.LOG_IN_SUCCESS,
                payload: response.data.data.token
            });
            setToken(response.data.data.token);
            dispatch(FlashMessage.addFlashMessage('success', 'Sukses Login'));
            resolve(response.data);
        })
        .catch((error) => {
            authErrorHandler(dispatch, error.response.data, ActionType.LOG_IN_FAILURE);
            dispatch(FlashMessage.addFlashMessage('error', 'Email address atau kata sandi anda salah.'));
            resolve(error.response.data)
        });
    })
}

export const logingoogle = (data) => (dispatch) => {
    return new Promise(async(resolve, reject) => {
        dispatch(apiAction.apiRequest());
        axios.post(AppConstant.API_URL + 'logingoogle', data, headers)
        .then((response) => {
            dispatch({
                type: ActionType.LOG_IN_SUCCESS,
                payload: response.data.data.token
            });
            setToken(response.data.data.token);
            dispatch(FlashMessage.addFlashMessage('success', 'Sukses Login'));
            resolve(response.data)
        })
        .catch((error) => {
            authErrorHandler(dispatch, error.response, ActionType.LOG_IN_FAILURE);
            dispatch(FlashMessage.addFlashMessage('error', 'Email address atau kata sandi anda salah.'));
        });
    })
}

export const verifyToken = (token) => (dispatch) => {
    return new Promise(async(resolve, reject) => {
        const token = await getToken();
        let header = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization" : "Bearer "+token
            }
        }
        axios.get(AppConstant.API_URL + 'verifytoken', header)
        .then((response) => {
            dispatch({type: ActionType.LOG_IN_SUCCESS, payload: token});
        })
        .catch((error) => {
            if(error.response.data?.status == 401) {
                dispatch({
                    type: ActionType.LOG_OUT
                });
                clearToken();
            }
        });
    })
}

export const logout = (data) => (dispatch) => {
    return new Promise(async(resolve, reject) => {
        const token = await getToken();
        const header = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        
        dispatch(apiAction.apiRequest());
        axios.get(AppConstant.API_URL + 'logout', header)
        .then((response) => {
            if(response.data.success){
                clearToken();
            }
            dispatch({
                type: ActionType.LOG_OUT
            });
            dispatch(FlashMessage.addFlashMessage('success', 'Sukses Logout'));
            resolve(response.data)
        })
        .catch((error) => {
            dispatch(FlashMessage.addFlashMessage('error', 'Logout gagal.'));
            resolve(error.response.data)
        });
    })
}

export function authErrorHandler(dispatch, error, type) {
    let errorMessage = (error.data.message) ? error.data.message : error.data;
    // NOT AUTHENTICATED ERROR
    if (error.status === 401) {
        errorMessage = 'You are not authorized to do this. Please login and try again.';
    }
    if(error.status === 201){
        errorMessage = error
    }
    dispatch({
        type,
        payload: errorMessage,
    });
}