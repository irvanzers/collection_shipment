import React from 'react';
import {View} from 'react-native'
import {PropTypes} from 'prop-types'
import RNPickerSelect, { defaultStyles }  from 'react-native-picker-select';
import {theme} from './../../constants/theme';
import Text from './../Text';

function SelectPicker(props) {
    const placeholder = {
        label: `PILIH ${props.placeholder}`,
        value: '',
        color: '#9EA0A4',
    };
    const pickerStyle = {
        inputIOS: {
            color: 'black',
            paddingTop: 13,
            paddingHorizontal: 10,
            paddingBottom: 12,
        },
        inputAndroid: {
            color: 'black',
            paddingHorizontal: 10,
        },
        placeholderColor: theme.colors.primary,
        underline: { 
            borderTopWidth: 1 
        },
        icon: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 5,
            borderTopColor: '#00000099',
            borderRightWidth: 5,
            borderRightColor: 'transparent',
            borderLeftWidth: 5,
            borderLeftColor: 'transparent',
            width: 0,
            height: 0,
            top: 20,
            right: 15,
        },
    }
    const styles = {
        error: {
            color: theme.colors.error,
        },
    };
    return (
        <View>
            <RNPickerSelect
                placeholder={placeholder}
                items={
                    props.items ? 
                    props.items 
                    : 
                    {
                        'label': '',
                        'value': ''
                    }
                }
                style={pickerStyle}
                onValueChange={props.onDataChange}
                value={props.value}
            />
            <View style={{borderTopWidth: 1, borderTopColor: 'grey'}} />
            { props.errorText && (
                <Text title={props.errorText} style={styles.error} p />
            )}
        </View>
    );
}
SelectPicker.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
    })),
    onDataChange: PropTypes.func,
    value: PropTypes.string
};

export default SelectPicker;