import React, { useState} from 'react';
import {PropTypes} from 'prop-types'
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {theme} from './../../constants/theme';

function MyDatePicker(props) {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    
  const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showDatepicker = () => {
        showMode('date');
    };
    return (
        // <DateTimePicker 
        //     value={date}
        //     mode={mode}
        //     is24Hour={true}
        //     display="default"
        //     onChange={onChange}
        // />
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