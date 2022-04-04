import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { Button, TouchableRipple, Appbar } from 'react-native-paper';
// import { useDispatch, useSelector } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { getMeProfile } from './../../actions/';
import { theme } from './../../constants/theme';
import Text from './../../components/Text';

const SCREEN_WIDTH = Dimensions.get('window').width;

const UbahProfile = (props) => {
    // const dispatch = useDispatch();
    // const profil = useSelector((state) => {
    //     const itm = state.profileme.items
    //     return state.profileme.items
    // })
    // useEffect(() => {
    //     const dataGet = () => {
    //         dispatch(getMeProfile());
    //     }
    //     dataGet();
    // }, [])
    // if(profil == null){
    //     return null
    // }
    
    return (
        <View
            style={styles.container}
        >
            {/* <Appbar.Header>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={'PROFIL'} />
            </Appbar.Header> */}
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1 }}>
                    <View style={styles.viewLine, { paddingTop: 10 }} />
                    <TouchableRipple 
                        style={{ backgroundColor: 'white' }} 
                        rippleColor="rgba(0, 0, 0, .32)" 
                    >
                        <View style={styles.listMenu}>
                            <View style={styles.listSubMenu}>
                                <Text style={styles.textMenu} title={'Nama Lengkap'} p />
                            </View>
                            <View style={styles.listSubMenu}>
                                <Text style={styles.textMenu} title="" p />
                                {/* <Icon name="keyboard-arrow-right" size={30} color='grey' /> */}
                            </View>
                        </View>
                    </TouchableRipple>
                    <View style={styles.viewLine} />
                    <TouchableRipple
                        style={{ backgroundColor: 'white' }}
                        rippleColor="rgba(0, 0, 0, .32)"
                    >
                        <View style={styles.listMenu}>
                            <View style={styles.listSubMenu}>
                                <Text style={styles.textMenu} title={'Username'} p />
                            </View>
                            <View style={styles.listSubMenu}>
                                <Text style={styles.textMenu} title="" p />
                                {/* <Icon name="keyboard-arrow-right" size={30} color='grey' /> */}
                            </View>
                        </View>
                    </TouchableRipple>
                    <View style={styles.viewLine} />
                    <TouchableRipple
                        style={{ backgroundColor: 'white' }}
                        rippleColor="rgba(0, 0, 0, .32)"
                    >
                        <View style={styles.listMenu}>
                            <View style={styles.listSubMenu}>
                                <Text style={styles.textMenu} title={'Email'} p />
                            </View>
                            <View style={styles.listSubMenu}>
                                <Text style={styles.textMenu} title="" p />
                                {/* <Icon name="keyboard-arrow-right" size={30} color='grey' /> */}
                            </View>
                        </View>
                    </TouchableRipple>
                    <View style={styles.viewLine} />
                    <TouchableRipple
                        style={{ backgroundColor: 'white' }}
                        rippleColor="rgba(0, 0, 0, .32)"
                    >
                        <View style={styles.listMenu}>
                            <View style={styles.listSubMenu}>
                                <Text style={styles.textMenu} title={'NIK'} p />
                            </View>
                            <View style={styles.listSubMenu}>
                                <Text style={styles.textMenu} title="" p />
                                {/* <Icon name="keyboard-arrow-right" size={30} color='grey' /> */}
                            </View>
                        </View>
                    </TouchableRipple>
                    
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.secondary,
    },
    listMenu: {
        flexDirection: 'row',
        padding: 10,
        width: '100%',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listSubMenu: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textMenu: {
        paddingLeft: 10,
        letterSpacing: .5,
        color: 'grey'
    },
    viewLine: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#C8C8C8',
    }
});

export default UbahProfile;