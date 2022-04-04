import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConstant from '../constants/app';

let headers = {
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
}

export async function fetch(url, pathParam, data) {
    const token = await AsyncStorage.getItem(AppConstant.TOKEN);
    if(token != null){
        headers = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
    }
    if(data === undefined) {
        data = '';
    }
    console.log(url + pathParam + data)
    return axios
        .get(url + pathParam + data, headers);
}

export async function store(url, pathParam, data) {
    const token = await AsyncStorage.getItem(AppConstant.TOKEN);
    if(token != null){
        headers = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
    }
    return axios.post(url + pathParam, data, headers);
}

export function update(url, pathParam, data) {
    return axios
        .put(url + pathParam, data, headers);
}

export function destroy(url, pathParam) {
    return axios
        .delete(url + pathParam, headers);
}