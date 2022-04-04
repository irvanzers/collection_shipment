import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConstant from '../constants/app';

export const setToken = token => AsyncStorage.setItem(AppConstant.TOKEN, token);
export const getToken = () => AsyncStorage.getItem(AppConstant.TOKEN);
export const clearToken = () => AsyncStorage.removeItem(AppConstant.TOKEN);
export const setUuid = uuid => AsyncStorage.setItem(AppConstant.UUID, uuid);
export const getUuid = () => AsyncStorage.getItem(AppConstant.UUID);
export const setSavedList = data => AsyncStorage.setItem(AppConstant.SAVED_LIST, JSON.stringify(data));
export const removeSavedList = () => AsyncStorage.removeItem(AppConstant.SAVED_LIST);
export const getSavedList = () => AsyncStorage.getItem(AppConstant.SAVED_LIST);