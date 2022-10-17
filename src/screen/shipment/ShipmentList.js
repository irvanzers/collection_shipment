import React, { useCallback, useState, useEffect }  from 'react'
import { Button, View, StyleSheet, FlatList, InteractionManager, Alert, TouchableHighlight } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker';
import { Card, Title, Colors, Appbar, Menu } from 'react-native-paper';
import Moment from 'moment';
import Loading from './../../components/Loading';
import Text from './../../components/Text';
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _, { reduce } from 'lodash';
import * as apiAction from './../../redux/actions/apiAction';
import * as crudAction from '../../redux/actions/crudAction';
import * as flashMessage from '../../redux/actions/flashMessage';
import * as authService from './../../redux/services/authService';
import Common from './../../redux/constants/common';
import { theme } from '../../redux/constants/theme';
import {getUuid, setUuid} from './../../redux/utils/actionUtil';
import { useNavigation } from '@react-navigation/core';
import { API_URL, ROOT_URL } from './../../redux/constants/app';


const ShipmentList = ( props ) => {
    const { shipmentdata, shipmentlistdetail }=props; 
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        dispatch(fetchGetVisitHistory({
            visit_date: Moment(currentDate).format('YYYY-MM-DD'),
            user_id: selectKowil
        }))
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showDatepicker = () => {
        showMode('date');
    };

        
    const handlePress = () => setExpanded(!expanded);
    
    const onBacks = () => { props.navigation.goBack(); props.route.params.onBackp(); };
    
    const loadData = async() => {  
        try {
            const datasubmit = {
                header_id: props.route.params.data,
                // user_id: props.route.params.data,
            }
            // await props.actions.fetchAll(Common.COLLECTION_DATA);    
            await props.actions.fetchAll(Common.SHIPMENT_LIST_DETAIL, datasubmit);
            setIsLoading(false);  
        } catch (error) {
            alert(error)
        } finally {
            setIsLoading(false);        
        }
    }

    const onSubmitHeader = async(data) => {
        try {
            const datasubmit = {
                shipment_header_id: props.route.params.data,
            }
        //   setIsLoading(true)
        //   data['collection_header_id'] = props.route.params.data;
        //   console.log(data)
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

    useEffect(() => {
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
        return (
            <>
            <View flexDirection="row" style={{marginVertical: 5}}>                
                <View style={[styles.viewLine, { paddingTop: 0 }]} />
                <View style={styles.divider} />               
                    <TouchableHighlight
                        onPress={() => navigation.push('ShipmentDetail', {item: item ? item : {}, onBackList: () => onGoBack()})}
                        style={{ backgroundColor: 'white' }}
                        activeOpacity={0.8}
                        underlayColor="#bbbcbd"
                        style={[styles.listMenu]}
                    >
                        <>
                            <View style={styles.listSubMenu}>
                                <MaterialComunityIcons color={item.job_status <= 1 ? 'green' : 'grey'} name={"briefcase-check"} size={30} />
                                <Text style={[styles.textMenu]} title={item.cust_name} p />
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
          {/* <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={<Appbar.Action icon={'dots-vertical'} onPress={openMenu} color={'white'} />}>
                  {visithistory != '' && visithistory.kowil.map((item, index) => {
                      return(
                          <Menu.Item 
                              key={index.toString()} 
                              onPress={() => onSelect(item)} 
                              title={`${item.kowil_code}`} 
                              subtitle={`${item.name}`} 
                          />
                      )
                  })}
          </Menu> */}
      </Appbar.Header>
      
      <Loading loading={isLoading} /> 
    
        <FlatList style={styles.list}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            initialNumToRender={3}
            data={listshipment}
            ListHeaderComponent={renderTopItem}
            keyExtractor={keyExtractor}
            renderItem={statusheader.status != '-' ? renderCategory : renderNonCategory}
            // renderItem={{}}
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