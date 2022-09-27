import React, { useState, useEffect, useCallback }  from 'react'
import { View, StyleSheet, ScrollView, TouchableHighlight, InteractionManager, PermissionsAndroid, Platform, Alert, TouchableOpacity } from 'react-native'
import { useForm, Controller } from 'react-hook-form';

import { List, Card, Title, Paragraph, Button, TextInput, IconButton, Appbar, Colors } from 'react-native-paper';
import Text from './../../components/Text';
import Input from '../../components/Input';
import SelectPicker from './../../components/SelectPicker';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import Loading from './../../components/Loading';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _, { pick, reduce } from 'lodash';
import * as apiAction from './../../redux/actions/apiAction';
import * as crudAction from '../../redux/actions/crudAction';
import * as flashMessage from '../../redux/actions/flashMessage';
import * as authService from './../../redux/services/authService';
import Common from './../../redux/constants/common';
import { theme } from '../../redux/constants/theme';
import {getUuid, setUuid} from './../../redux/utils/actionUtil';
import { useNavigation } from '@react-navigation/core';


function useInput(){
    const [pickDate, setPickDate] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setPickDate(selectedDate);
    };
  
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showDatepicker = () => {
        showMode('date');
    };
    
    return {
        date,
        showDatepicker,
        show,
        mode,
        pickDate,
        onChangeDate,
    }
}

const ShipmentShipConfirm = ( props ) => {
    const itemProd = props.route.params.data;
    const {detailsj} = props;
    const { handleSubmit, control, formState: {errors}, setValue, getValues } = useForm(); // initialize the hook
    const [isLoading, setIsLoading] = useState(true);
    const [disButton, setDisButton] = useState(false);
    const [expanded, setExpanded] = useState(1);
    const inputSJ = useInput(null);

    const loadData = async () => {
        setIsLoading(false);  
        setDisButton(false);
        try {
            const datasubmit = {
                delivery_id: itemProd?.delivery_id,
                header_id: itemProd?.header_id,
            }
            // console.log(itemDet)
            await props.actions.fetchAll(Common.SHIPMENT_DETAIL_SJ, datasubmit); 
        } catch (error) {
            alert(error)
        } finally {
        setIsLoading(false);  
        setDisButton(false);  
        }
    }
    
    const onBacks = () => { 
        props.navigation.goBack(); 
        props.route.params.onBackDetail(); 
    };

    const onShipConfirm = async(data) => {
      try {
        data['shipconfirm_date'] = moment(pickdatesj).format('YYYY-MM-DD');
        data['delivery_id'] = datasj.delivery_id;
        data['user_id'] = datasj.user_id;
        console.log(data);
      } catch (error) {
        alert(error)
      }
    }
    

    useEffect(() => {
        const interactionPromise = InteractionManager.runAfterInteractions(() => {
            loadData()
        });
        setIsLoading(false)
        return () => interactionPromise.cancel();
    },[])
    
    const datasj = detailsj ? detailsj.detaildatasj : [];
    const listprod = detailsj ? detailsj.itemprod : [];
    const datesj = inputSJ.date != new Date(datasj.shipconfirm_date) ? inputSJ.date : new Date(datasj.shipconfirm_date);
    const pickdatesj = inputSJ.date == inputSJ.pickDate ? inputSJ.pickDate : datesj;

    return(
        <View style={{flex:1}}>
        <Appbar.Header>
            <Appbar.BackAction onPress={() => onBacks()} />
            <Appbar.Content title={'DETAIL SURAT JALAN'} />
        </Appbar.Header>
        <ScrollView
            style={{flex:1}}
            showsVerticalScrollIndicator={false}
            horizontal={false}
        >
            <Loading loading={isLoading} />
            <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                <Card>
                    <Card.Content>  
                        <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10, marginBottom: 15}}>
                            <Text title={`No. Surat Jalan ${datasj.delivery_name}`} bold />
                            <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end', paddingLeft: '15%'}}>
                            {datasj.status_ship_confirm == 1 ?
                                <Text 
                                    title={'SUDAH SHIP CONFRIM'} bold style={{ color: 'green' }}
                                />
                                :
                                (
                                <>
                                    <Text 
                                        title={'BELUM SHIP CONFIRM'} bold style={{ color: 'grey' }}
                                    />
                                </>
                                )
                            }
                            </View>
                        </View>
                        <Title style={{color: '#000000', fontWeight: 'bold'}}>
                            {datasj.outlet_name}
                        </Title>
                    </Card.Content>
                </Card>
                </View>
                <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>     
                <Card>
                    <Card.Content>
                    <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 8, paddingBottom: 8}}>
                        <Text
                            title="Rincian Produk" 
                            h5 bold style={{color: '#000000'}} 
                        />
                    </View>
                    <View style={{marginTop: 15}}>
                        <Button icon={expanded != 0 ? 'arrow-down-thick' : 'arrow-up-thick'} mode='text' onPress={ () => setExpanded(!expanded) }>
                        { expanded != 0 ? 'More Detail' : 'Less More'}
                        </Button> 
                    </View>
                    { expanded == 0 &&
                        <>
                        { listprod?.map((item, index) => {
                            return (
                            <React.Fragment
                                key={index.toString()}
                            >
                                <List.Item
                                title={item.item_description}
                                description={
                                                props =>
                                                <>
                                                <Text {...props} title={`Qty: ${item.quantity}`} style={{ paddingTop: 6, color: '#797A7B' }} />
                                                {/* <Text {...props} title={`Kg: 0${item.kg}`} style={{ paddingTop: 6, color: '#797A7B' }} />
                                                <Text {...props} title={`m3: 0${item.m3}`} style={{ paddingTop: 6, color: '#797A7B' }} /> */}
                                                </>
                                            }
                                left={props => <List.Icon {...props} icon="chevron-double-right" />}
                                />
                            </React.Fragment>
                            )
                        })}
                        </>
                    }
                    <View style={{ paddingTop: 10 }} />
                    <View style={{marginTop: 15}} />
                    <Text title="Tanggal Ship Confirm" bold h6 />
                        <Controller
                            // defaultValue={dateinput1}
                            name="shipconfirm_date"
                            control={control}
                            // rules={{ required: { value: true, message: 'Tanggal kunjungan harus diisi' } }}
                            render={({ field: {onChange, value, onBlur} }) => {
                            return (
                            <>
                                <View flexDirection="row" justifyContent="space-between" style={{ borderColor: 'grey', borderWidth: 0 }}>
                                {inputSJ.show && (
                                    <DateTimePicker
                                        testID="dateTimePicker1"
                                        value={new Date(pickdatesj)}
                                        mode={'date'}
                                        format="YYYY-MM-DD"
                                        display="default"
                                        onChange={inputSJ.onChangeDate}
                                    />
                                )}
                                <Text 
                                    title={moment(pickdatesj).format('YYYY-MM-DD')}
                                    // title={moment(date).format('YYYY-MM-DD')}
                                    style={{ paddingTop: '9%', paddingLeft: '35%', fontSize: 15 }}
                                    onPress={inputSJ.showDatepicker}
                                    // onPress={showDatepicker}
                                />
                                <IconButton
                                    icon="calendar-range"
                                    color={Colors.red400}
                                    size={35}
                                    onPress={inputSJ.showDatepicker}
                                    // onPress={showDatepicker}
                                    style={{ paddingTop: 20, color: '#F3114B'}}
                                />
                                </View>
                                <View style={{borderColor: theme.colors.primary, borderWidth: 1}} />  
                            </>
                            )}}
                        />
                        <View style={{ paddingTop: 15 }} />
                        <Button
                        mode="contained"
                        onPress={handleSubmit(onShipConfirm)}
                        disabled={disButton} 
                        >SHIP CONFIRM
                        </Button>
                    </Card.Content>
                </Card>
                </View>

            </ScrollView>
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
      // justifyContent: 'center', 
      paddingLeft: 20,
      fontSize: 14,
      fontWeight: 'bold',
  },
  textCamera: {
      height: '90%', 
      backgroundColor: 'black', 
      // display: 'flex', 
      justifyContent: 'center', 
      paddingLeft: 10,
      fontSize: 14,
      fontWeight: 'bold',
  },
  viewBox: {
      marginTop: 10, 
      backgroundColor: '#ffff', 
      padding: 10
  }
})

function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated,
      apiState: state.api,
      message: state.flash.message,
      detailsj: state.crud.detailsjs,
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(_.assign({}, crudAction, apiAction, flashMessage, authService), dispatch)
    }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(ShipmentShipConfirm);