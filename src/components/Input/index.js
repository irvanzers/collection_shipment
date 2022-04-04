import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import Text from './../Text';
import {theme} from "./../../constants/theme";

function Input(props) {
    return (
        <View style={styles.wrapper}>
            <TextInput
                {...props}
                style={[styles.input, props.error && styles.borderRed500, props.style]}
                mode="outlined"
                error={props.errorText && true}
                autoCapitalize={'characters'}
            />
            { props.errorText && (
                <Text title={props.errorText} style={styles.error} p />
            )}
        </View>
    );
}

const styles = {
    input: {
        backgroundColor: theme.colors.secondary,
    },
    borderRed500: {
        borderColor: 'red'
    },
    error: {
        color: theme.colors.error,
    },
};

export default Input