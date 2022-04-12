import React from 'react';
import {PropTypes} from 'prop-types'
import DatePicker from 'react-native-datepicker';
// import DatePicker from '@react-native-community/datetimepicker';
import {theme} from './../../constants/theme';

function MyDatePicker(props) {
    return (
        <DatePicker
            style={{
                width: '100%'
            }}
            date={props.date}
            mode="date"
            format="YYYY-MM-DD"
            minDate={props.minDate}
            maxDate={props.defaultDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
                dateInput: {
                    borderColor: theme.colors.primary, 
                    borderWidth:0,
                },
                dateTouchBody: {
                    borderColor: theme.colors.primary, 
                    borderBottomWidth: 2
                } 
            }}
            value={props.value}
            onDateChange={props.onDateChange} 
        />
    );
}

MyDatePicker.propTypes = {
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  date: PropTypes.string
};

export default MyDatePicker;