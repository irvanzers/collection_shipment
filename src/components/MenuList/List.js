import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/core';

import { theme } from './../../constants/theme';
import Text from './../Text/';

const List = props => {
    const navigation = useNavigation();
    const {
        nav,
        title,
        iconList,
        componentOther,
        rightComponent,
        height,
        sizeIcon,
        fontSize,
         ...rest
    } = props;
    return (
        <TouchableHighlight
            onPress={() => navigation.navigate(nav)}
            style={{ backgroundColor: 'white' }}
            activeOpacity={0.8}
            underlayColor="#bbbcbd"
            style={[styles.listMenu, height && {height: height}]}
        >
            <>
                <View style={styles.listSubMenu}>
                    <MaterialComunityIcons color={theme.colors.primary} name={iconList} size={sizeIcon} />
                    <Text style={styles.textMenu, fontSize && {fontSize: fontSize}} title={title} p />
                </View>
                <View flexDirection="row" style={{ alignItems: 'center' }}>
                    {componentOther && componentOther()}
                    { rightComponent ?
                        rightComponent()
                        : 
                        <Icon name="keyboard-arrow-right" color="#aeaeae" size={28} />
                    }
                </View>
            </>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    listMenu: {
        flexDirection: 'row',
        padding: 10,
        width: '100%',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    listSubMenu: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textMenu: {
        paddingLeft: 10,
        letterSpacing: .5,
        fontSize: 16
    },
});

export default List;