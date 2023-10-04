import React, { useCallback, useState, useEffect }  from 'react'
import { View, StyleSheet, FlatList, InteractionManager, RefreshControl, PermissionsAndroid, Platform, TouchableHighlight } from 'react-native'

import { Appbar } from 'react-native-paper';
import Moment from 'moment';
import Loading from './../../components/Loading';
import Text from './../../components/Text';
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

const ShipmentList = ( props ) => {
    const { shipmentdata, shipmentlistdetail }=props; 
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
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
                // user_id: props.route.params.data,
            }  
            await props.actions.fetchAll(Common.SHIPMENT_LIST_DETAIL, datasubmit);
            setIsLoading(false);  
        } catch (error) {
            alert(error)
        } finally {
            setIsLoading(false);        
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
    const listshipment = shipmentlistdetail ? shipmentlistdetail.assigned_data : [];
    const statusheader = shipmentlistdetail ? shipmentlistdetail.header_status : [];
    const assignedcount = shipmentlistdetail ? shipmentlistdetail.assigned_count : [];
    const assignedsjcount = shipmentlistdetail ? shipmentlistdetail.assigned_sj_count : [];
    
    const renderTopItem = ({}) => {
        return(   
            <View style={{flex:1}}>
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
            <View flexDirection="row" style={{height: 40, justifyContent: 'space-between',paddingBottom: 15,  paddingLeft: 10,  backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: .5}}>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`STATUS : ${statusheader?.status}`} p style={{ textTransform: 'uppercase', color: `${statusheader ? statusheader.color : '#B4B4B4'}` }} />
                    </View>
                </View>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TOTAL PENGIRIMAN(SJ): `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginRight: 10}}>
                        <Text title={assignedsjcount} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                    </View>
                </View>
            </View>
            {statusheader.status == '-' &&           
                <View style={{ 
                    paddingTop: 15,
                    alignItems: 'center',
                    paddingLeft: 15,
                    paddingRight: 15,
                }}>
                    <Text title={'Status Belum Di Open!'} h6 />
                    <Text title={'Mohon Upload Tanda Terima Surat Jalan & Foto KM Berangkat Terlebih Dahulu.'} style={{ textAlign: 'center' }} h6 />
                </View>
            }
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
                        onPress={() => navigation.push('ShipmentDetail', {item: item ? item : {}, onBackList: () => onGoBack()})}
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

    const renderNonCategory = () => {
        return(
            <View title={[]} />
        )
    }
  return (
    <View style={{ flex: 1 }}>
      
      <Appbar.Header>
          <Appbar.BackAction onPress={() => props.navigation.goBack()} />
          <Appbar.Content title={'LIST PENGIRIMAN'} />
          {/* <Appbar.Action
                icon={'barcode-scan'} 
                onPress={() => props.navigation.navigate('ScannerScreen')}
          /> */}
          <Appbar.Action
                icon={'briefcase-account-outline'} 
                onPress={() => props.navigation.navigate('ShipmentAbsenCar', {data: listshipment ? listshipment[0] : null, onBackList: () => onGoBack()})}
          />
      </Appbar.Header>
      
      <Loading loading={isLoading} /> 
    
        <FlatList style={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            horizontal={false}
            initialNumToRender={3}
            data={listshipment}
            ListHeaderComponent={renderTopItem}
            keyExtractor={keyExtractor}
            renderItem={statusheader.status != '-' ? renderCategory : renderNonCategory}
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
        shipmentdata: state.crud.shipmentdatas,
        shipmentlistdetail: state.crud.shipmentlistdetails,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(_.assign({}, authService, crudAction, apiAction, flashMessage), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipmentList)