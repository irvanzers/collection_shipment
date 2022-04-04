//libraries
import _ from 'lodash';

/**
 * Import all constants as an object.
 */
import * as ActionType from '../constants/actionType';

var initialState = {
    token: null,
    isAuthenticated: false,
    messages: null
};

/**
 * A reducer takes two arguments, the current state and an action.
 */
export default function AuthReducer(state , action) {
    state = state || initialState;
    switch (action.type) {
        case ActionType.LOG_IN_SUCCESS:
            return _.assign({}, state, {
                isAuthenticated: true,
                token: action.payload,
                messages: null
            });

        case ActionType.LOG_IN_FAILURE:
            return _.assign({}, state, {
                isAuthenticated: false,
                token: null,
                messages: null
            });

        case ActionType.LOG_OUT:
            return _.assign({}, state, {
                isAuthenticated: false,
                token: null,
                messages: null
            });
        case ActionType.REGISTER_SUCCESS:
            return _.assign({}, state, {
                isAuthenticated: false,
                token: action.payload,
                messages: null
            })
        case ActionType.REGISTER_FAILURE:
            return _.assign({}, state, {
                isAuthenticated: false,
                token: null,
                messages: action.payload,
            })
        default:
            return state;
    }
}