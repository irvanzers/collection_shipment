import * as ActionType from './../constants/actionType';
import config from './../../config';

export const initialState = {
    isOpen: 'dashboard', //for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    navType: config.theme,
    locale: config.i18n,
    rtlLayout: false, // rtlLayout: config.rtlLayout,
    opened: true
};

const customizationReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.MENU_OPEN:
            return {
                ...state,
                isOpen: action.isOpen
            };
        case ActionType.MENU_TYPE:
            return {
                ...state,
                navType: action.navType
            };
        case ActionType.THEME_LOCALE:
            return {
                ...state,
                locale: action.locale
            };
        case ActionType.THEME_RTL:
            return {
                ...state,
                rtlLayout: action.rtlLayout
            };
        case ActionType.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case ActionType.SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case ActionType.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        default:
            return state;
    }
};

export default customizationReducer;