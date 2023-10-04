import React, { useCallback, useState, useEffect }  from 'react'
import { View, StyleSheet, FlatList, InteractionManager, Alert, RefreshControl, Platform, PermissionsAndroid, TouchableHighlight } from 'react-native'

import Loading from './../../components/Loading';
import Text from './../../components/Text';
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appbar, Menu } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _, { reduce } from 'lodash';
import * as apiAction from './../../redux/actions/apiAction';
import * as crudAction from '../../redux/actions/crudAction';
import * as flashMessage from '../../redux/actions/flashMessage';
import * as authService from './../../redux/services/authService';
import Common from './../../redux/constants/common';
import { useNavigation } from '@react-navigation/core';
import haversineDistance from 'haversine-distance';

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const CollectionList = ( props ) => {
  const { collectiondata, collectionlistdetail }=props; 
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [position, setPosition] = useState({
      latitude: '',
      longitude: ''
  });


const onRefresh = useCallback(() => {
    setRefreshing(true)
    loadData();
    wait(2000).then(() => {
    setRefreshing(false)
    })
})

  const handlePress = () => setExpanded(!expanded);
  
  const onBacks = () => { props.navigation.goBack(); props.route.params.onBackp(); };
  
  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasLocationPermissionIOS();
      return hasPermission;
    }
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
    
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      Toast.show(
        'Location permission denied by user.',
        Toast.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Toast.show(
        'Location permission revoked by user.',
        Toast.LONG,
      );
    }
    return false;
  };
  
  const loadData = async() => {  
    try {
        const datasubmit = {
            header_id: props.route.params.data,
        } 
        await props.actions.fetchAll(Common.COLLECTION_LIST_DETAIL, datasubmit);
        setIsLoading(false);  
    } catch (error) {
        alert(error)
    } finally {
        setIsLoading(false);        
    }
}

const onSubmit = () => {
    Alert.alert(
        "PERHATIAN",
        "JIKA ADA JOB YANG BELUM DI VISIT/SUBMIT, MAKA STATUSNYA TIDAK TERKUNJUNGI!",
        [{
            text: "BATAL",
            onPress: () => console.log("No, continue editing")
        }, {
            text: "YA",
            onPress: () => {
                console.log('Yes')
                onSubmitHeader()
            },
            style: "cancel"
        }],
    );
}

const onSubmitHeader = async(data) => {
    try {
        const datasubmit = {
            collection_header_id: props.route.params.data,
        }
      const submitHeader = await props.actions.storeItem(Common.SUBMIT_HEADER_JOB, datasubmit);
      if(submitHeader.success){
          Toast.show('Header job berhasil disubmit');
          props.navigation.goBack();
      }
    } catch (error) {
      alert(error)
    }
}

const onGoBack = (data) => {
    loadData()
}

//GETTING POSITION LAT/LONG
const getPosition = async() => {
    const hasPermission = await hasLocationPermission();
    if(hasPermission){
      Geolocation.getCurrentPosition(
        pos => {
          setPosition({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
          });
        },
        (e) => {
          setError(e.message)
        }
      );
    }
};

useEffect(() => {
    getPosition()
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
        loadData()
    });
    return () => interactionPromise.cancel();
},[])

const keyExtractor = useCallback((item, index) => index.toString(), []);
const listcollection = collectionlistdetail ? collectionlistdetail.assigned_data : [];
const assignedarcount = collectionlistdetail ? collectionlistdetail.assigned_ar_count : [];
const assignedcount = collectionlistdetail ? collectionlistdetail.assigned_count : [];
const statusheader = collectionlistdetail ? collectionlistdetail.header_status : [];
const tunailist = collectionlistdetail ? collectionlistdetail.tunai_list : [];
const transferlist = collectionlistdetail ? collectionlistdetail.transfer_list : [];

    const renderTopItem = ({}) => {
        return(
            <View style={{flex:1}}>
            <View flexDirection="row" style={{height: 40, justifyContent: 'space-between', paddingLeft: 10,  backgroundColor: 'white'}}>
                <View flexDirection="row" style={{ justifyContent: 'space-between' }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`ID HEADER : ${statusheader.id}`} p style={{ textTransform: 'uppercase', color: 'grey' }} bold />
                    </View>
                </View>
            </View>
            <View flexDirection="row" style={{height: 40, justifyContent: 'space-between',  paddingLeft: 10,  backgroundColor: 'white'}}>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TANGGAL : ${statusheader.header_date}`} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                </View>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TOTAL OUTLET: `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginRight: 10}}>
                        <Text title={assignedcount} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                    </View>
                </View>
            </View>
            <View flexDirection="row" style={{height: 40, justifyContent: 'space-between', paddingBottom: 10, paddingLeft: 10,  backgroundColor: 'white'}}>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`STATUS : ${statusheader?.status}`} p style={{ textTransform: 'uppercase', color: `${statusheader ? statusheader.color : '#B4B4B4'}` }} />
                    </View>
                </View>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TOTAL TAGIHAN(AR): `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginRight: 10}}>
                        <Text title={assignedarcount} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                    </View>
                </View>
            </View>
            <View flexDirection="row" style={{height: 40, justifyContent: 'space-between',paddingBottom: 15,  paddingLeft: 10,  backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: .5}}>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TOTAL TRANSFER : `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginRight: 10}}>
                        <Text title={transferlist} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                    </View>
                </View>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TOTAL TUNAI: `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginRight: 10}}>
                        <Text title={tunailist} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                    </View>
                </View>
            </View>
            {/* { collectiondraft.id == '' &&
                <View style={{alignItems: 'center', marginTop: 10}}>
                    <Text title={'DATA TAGIHAN TIDAK DITEMUKAN'} p style={{color: 'grey'}} />
                </View>
            } */}   
        </View>
        )
    }

    const renderCategory = ({item, index}) => {
        const longlat = { latitude: item.visit_lat, longitude: item.visit_long };
        const longlat_device = { longitude: position.longitude, latitude: position.latitude };
        const jarak = Math.round(haversineDistance(longlat_device, longlat))/1000;
        return (
            <>
                <View flexDirection="row" style={{marginVertical: 5}}>                
                    <View style={[styles.viewLine, { paddingTop: 0 }]} />
                    <View style={styles.divider} />               
                        <TouchableHighlight
                            onPress={() => navigation.push('CollectionDetail', {item: item ? item : {}, onBackList: () => onGoBack()})}
                            activeOpacity={0.8}
                            underlayColor="#bbbcbd"
                            style={[styles.listMenu]}
                        >
                            <>
                                <View style={{alignContent: 'center', flexDirection: 'column'}}>
                                    <View style={styles.listSubMenu}>
                                        <MaterialComunityIcons color={item.job_status <= 1 ? 'green' : 'grey'} name={"briefcase-check"} size={30} />
                                        <Text style={[styles.textMenu]} title={item.cust_name} p />
                                    </View>
                                    { jarak <= '10.000' &&
                                        <Text style={[styles.textSubMenuDekat]} title={jarak+' KM'} p />
                                    }
                                    { jarak >= '10.000' && jarak <= '30.000' &&
                                        <Text style={[styles.textSubMenuSedang]} title={jarak+' KM'} p />
                                    }
                                    { jarak >= '30.000' &&
                                        <Text style={[styles.textSubMenuJauh]} title={jarak+' KM'} p />
                                    }
                                    { item.visit_lat == null &&
                                        <Text style={[styles.textSubMenuJauh]} title={'Belum Tercatat'} p />                                    
                                    }
                                </View>
                                <View flexDirection="row" style={{ alignItems: 'center' }}>
                                        <Icon name="keyboard-arrow-right" color="#aeaeae" size={28} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
            </>
        )
    }

  return (
    <View style={{ flex: 1 }}>      
      <Appbar.Header>
          <Appbar.BackAction onPress={() => onBacks()} />
          <Appbar.Content title={'LIST TAGIHAN'} />
          {/* <Appbar.Action
                icon={'barcode-scan'} 
                onPress={() => props.navigation.navigate('ScannerScreen')}
          /> */}
          <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={<Appbar.Action color="white" icon={'dots-vertical'} onPress={() => openMenu()} />}>
              <Menu.Item onPress={() => { onSubmit('submit') }} title="SUBMIT JOB" />
          </Menu>
      </Appbar.Header>     
      
      <Loading loading={isLoading} /> 
    
        <FlatList style={styles.list}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            initialNumToRender={3}
            data={listcollection}
            ListHeaderComponent={renderTopItem}
            keyExtractor={keyExtractor}
            renderItem={renderCategory}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  buttonCart: {
      display: 'flex', 
      alignSelf: 'center',
      width: '100%'
  },
  textOri: {
      height: '90%', 
      paddingTop: 30,
      backgroundColor: '#ffff', 
      display: 'flex', 
      paddingLeft: 20,
      fontSize: 14,
      fontWeight: 'bold',
  },
  textCamera: {
      height: '90%', 
      backgroundColor: 'black', 
      justifyContent: 'center', 
      paddingLeft: 10,
      fontSize: 14,
      fontWeight: 'bold',
  },
  viewBox: {
      marginTop: 10, 
      backgroundColor: '#ffff', 
      padding: 10
  },
  listMenu: {
      flexDirection: 'row',
      padding: 10,
      width: '100%',
      height: 60,
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
  textSubMenuDekat: {
      paddingLeft: 40,
      letterSpacing: .5,
      fontSize: 12,
      color: 'green',
  },
  textSubMenuSedang: {
      paddingLeft: 40,
      letterSpacing: .5,
      fontSize: 12,
      color: '#D0CD2A',
  },
  textSubMenuJauh: {
      paddingLeft: 40,
      letterSpacing: .5,
      fontSize: 12,
      color: 'red',
  },
})


function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        apiState: state.api,
        message: state.flash.message,
        collectiondata: state.crud.collectiondatas,
        collectionlistdetail: state.crud.collectionlistdetails,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(_.assign({}, authService, crudAction, apiAction, flashMessage), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionList)