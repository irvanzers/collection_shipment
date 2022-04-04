import { createStore, applyMiddleware } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';

const persistConfig = {
    key: '__gstore__',
    storage: AsyncStorage,
    blacklist: ['productdetailguests', 'auth']
};

const pReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

const persistor = persistStore(store);

export {
    store,
    persistor
};