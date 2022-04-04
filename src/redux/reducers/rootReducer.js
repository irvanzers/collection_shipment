import { combineReducers } from 'redux';

import authReducer from './authReducer';
import apiReducer from './apiReducer';
import crudReducer from './crudReducer';
import flashMessageReducer from './flashMessageReducer';

import customizationReducer from './customizationReducer';
import snackbarReducer from './snackbarReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    crud: crudReducer,
    api: apiReducer,
    flash: flashMessageReducer,
    customization: customizationReducer,
    snackbar: snackbarReducer
});

export default rootReducer;