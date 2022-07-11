import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, InteractionManager } from 'react-native';
import { Button, TouchableRipple, Appbar } from 'react-native-paper';
// import { useDispatch, useSelector } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { getMeProfile } from './../../actions/';
import { theme } from './../../constants/theme';
import Text from './../../components/Text';
import Loading from './../../components/Loading';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _, { reduce, update } from 'lodash';
import * as apiAction from './../../redux/actions/apiAction';
import * as crudAction from '../../redux/actions/crudAction';
import * as flashMessage from '../../redux/actions/flashMessage';
import * as authService from './../../redux/services/authService';
import Common from './../../redux/constants/common';

const SCREEN_WIDTH = Dimensions.get('window').width;

const UbahProfile = (props) => {
    const { usercollector } = props;
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async() => {  
      try { 
          await props.actions.fetchAll(Common.USER_COLLECTOR_PROFILE);
          setIsLoading(true);  
      } catch (error) {
          alert(error)
      } finally {
          setIsLoading(false);        
      }
    }
  
    useEffect(() => {
        const interactionPromise = InteractionManager.runAfterInteractions(() => {
            loadData()
        });
        return () => interactionPromise.cancel();
    },[])
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
                                <Text style={styles.textMenu} title={usercollector.name} p />
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
                                <Text style={styles.textMenu} title={usercollector.username} p />
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
                                <Text style={styles.textMenu} title={usercollector.email} p />
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
                                <Text style={styles.textMenu} title={usercollector.nik} p />
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

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        apiState: state.api,
        message: state.flash.message,
        usercollector: state.crud.usercollectors,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(_.assign({}, authService, crudAction, apiAction, flashMessage), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UbahProfile);