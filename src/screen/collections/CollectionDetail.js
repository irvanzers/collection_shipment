import React, { useState, useEffect, useCallback }  from 'react'
import { View, StyleSheet, ScrollView, TouchableHighlight, InteractionManager, PermissionsAndroid, Platform, Alert, TouchableOpacity } from 'react-native'
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import Text from './../../components/Text';
import Input from '../../components/Input';
import SelectPicker from './../../components/SelectPicker';
import { List, Card, Title, Paragraph, Button, IconButton, Appbar, Colors } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import NumberFormat from 'react-number-format';
import Loading from './../../components/Loading';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
import Clipboard from '@react-native-clipboard/clipboard';

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
import { TextInputMask } from 'react-native-masked-text';

const checkSelfie = () => {
  Alert.alert(
      "PERIKSA FORM INPUTAN",
      "SELFIE TIDAK BOLEH KOSONG.",
      [{
          text: "YA",
          onPress: () => console.log("Ya"),
          style: "yes"
      }],
  );
  return true;
}

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

let total_pembayaran = 0;

const CollectionDetail = ( props ) => {
  const listcust = props.route.params.data;
  const itemDet = props.route.params.item;
  const {collectiondetail} = props;
  const navigation = useNavigation();
  const [text, setText] = React.useState("");
  const { handleSubmit, control, formState: {errors}, setValue, getValues } = useForm(); // initialize the hook
  const [error, setError] = useState('');
  const [open, setOpen] = useState([]);
  const [expanded, setExpanded] = useState(1);
  const [visitSelfie, setVisitSelfie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusTagihan, setStatusTagihan] = useState('');
  const [position, setPosition] = useState({
      latitude: '',
      longitude: ''
  });
  const ROOT_URL = 'https://egis.galenium.com/v1/';
  const [mountTransfer, setMountTransfer] = useState(0);
  const [mountTunai, setMountTunai] = useState(0);
  const [mountGiro, setMountGiro] = useState(0);
  const [disButton, setDisButton] = useState(false);
  const input1 = useInput(null);
  const input2 = useInput(null);
  let jobstatus = false;
  let total_tagihan = 0;
  let total_bayar = 0;
  let total_transfer = 0;
  let total_tunai = 0;
  let total_giro = 0;
  let total_sisa = 0;

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
  
  const onBackz = () => { props.navigation.goBack(); props.route.params.onBackList(); };

  const loadData = async () => {
    setIsLoading(false);  
    setDisButton(false);
      try {
          const datasubmit = {
              cust_id: itemDet?.cust_id,
              header_id: itemDet?.collection_header_id,
          }
          await props.actions.fetchAll(Common.COLLECTION_DETAIL, datasubmit); 
          // GAUSAH DI PAKE UDH FIX UNTUK FOTO   
          // if (detaildata.image_visit != '') {
          //   setVisitSelfie(detaildata.image_visit);
          // }
      } catch (error) {
          alert(error)
      } finally {
        setIsLoading(false);  
        setDisButton(false);  
      }
  }
  
  const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
  const removeCommas = num => num.toString().replace(/\,/g, "");

  const onSubmitAll = async(data) => {
    try {
      if(detaildata.image_visit == null){
          checkSelfie()
          return true;
      }
      // setDisButton(true);
      // setIsLoading(true);  
      data['payment_all_ar'] = true;
      data['cust_id'] = detaildata.cust_id;
      data['header_id'] = detaildata.collection_header_id;
      data['visit_date'] = moment(new Date()).format('YYYY-MM-DD');
      data['visit_lat'] = position.latitude;
      data['visit_long'] = position.longitude;
      if (statusTagihan == 'tukar_faktur'){
        data['status_tukar_faktur'] = '1';
      }
      data['nominal_payment_tunai'] = totTunai;
      data['nominal_payment_transfer'] = totTransfer;
      data['nominal_payment_giro'] = totGiro;
      data['total_payment'] = total_pembayaran;
      data['job_status'] = '3';
      data['transfer_date'] = moment(pickdate1).format('YYYY-MM-DD');
      data['giro_date'] = moment(pickdate2).format('YYYY-MM-DD');
      console.log(data)
      const updatePay = await props.actions.storeItem(Common.UPDATE_COLLECTION_PAYMENT, data);
      if(updatePay.success){
          // await props.actions.fetchAll(Common.USER_PROFILE);
          props.route.params.onBackList();
          Toast.show('Pembayaran berhasil disimpan');
          props.navigation.goBack();
      }
    } catch (error) {
      alert(error)
    }
  }

  const onSubmit = async(data) => {
    try {
      if(detaildata.image_visit == null){
          checkSelfie()
          return true;
      } 
      setDisButton(true);
      setIsLoading(true); 
      data['submit_all_ar'] = true;
      data['cust_id'] = detaildata.cust_id;
      data['header_id'] = detaildata.collection_header_id;
      data['visit_date'] = moment(new Date()).format('YYYY-MM-DD');
      data['visit_lat'] = position.latitude;
      data['visit_long'] = position.longitude;
      if (statusTagihan == 'tukar_faktur'){
        data['status_tukar_faktur'] = '1';
      }
      data['job_status'] = '3';
      // console.log(data)
      const updatePay = await props.actions.storeItem(Common.UPDATE_COLLECTION_PAYMENT, data);
      if(updatePay.success){
          // await props.actions.fetchAll(Common.USER_PROFILE);
          props.route.params.onBackList();
          Toast.show('Pembayaran berhasil disimpan');
          props.navigation.goBack();
      }
    } catch (error) {
      alert(error)
    }
  }
  
  const onSaveDraft = async(data) => {
    try {
      if(detaildata.image_visit == null){
          checkSelfie()
          return true;
      } 
      // setDisButton(true);
      // setIsLoading(true); 
      data['payment_all_ar'] = true;
      data['cust_id'] = detaildata.cust_id;
      data['header_id'] = detaildata.collection_header_id;
      data['visit_date'] = moment(new Date()).format('YYYY-MM-DD');
      data['visit_lat'] = position.latitude;
      data['visit_long'] = position.longitude;
      if (statusTagihan == 'tukar_faktur' || detaildata.status_tukar_faktur == '1'){
        data['status_tukar_faktur'] = '1';
      }
      data['nominal_payment_tunai'] = totTunai;
      data['nominal_payment_transfer'] = totTransfer;
      data['nominal_payment_giro'] = totGiro;
      data['total_payment'] = total_pembayaran;
      data['job_status'] = '1';
      data['transfer_date'] = moment(pickdate1).format('YYYY-MM-DD');
      data['giro_date'] = moment(pickdate2).format('YYYY-MM-DD');
      // console.log(data)
      const updatePay = await props.actions.storeItem(Common.UPDATE_COLLECTION_PAYMENT, data);
      if(updatePay.success){
      //  await props.actions.fetchAll(Common.USER_PROFILE);
          props.route.params.onBackList();
          Toast.show('Pembayaran berhasil disimpan');
          props.navigation.goBack();
      }
    } catch (error) {
      alert(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSavePhoto = async(source) => {
    try {
      let datasubmit = {};
      if(source == null){
          checkSelfie()
          return true;
      }
      // setIsLoading(true)
      datasubmit['payment_all_ar_photos'] = true;
      datasubmit['cust_id'] = detaildata.cust_id;
      datasubmit['header_id'] = detaildata.collection_header_id;
      datasubmit['visit_selfie'] = source;
      const updatePay = await props.actions.storeItem(Common.UPDATE_COLLECTION_PAYMENT, datasubmit);
      if(updatePay.success){
          // await props.actions.fetchAll(Common.USER_PROFILE);
          Toast.show('Foto berhasil disimpan');
          loadData()
      }
    } catch (error) {
      alert(error)
    }
  }

  //GETTING PHOTO
  const renderAsset = (fotoSelfie) => {
      return (
          <Card style={{ width: '100%' }}>
              <Card.Cover source={{uri: `${ROOT_URL}${fotoSelfie}`}} style={{ height: 300 }} />
              <Card.Actions style={{justifyContent: 'center'}}>
                  {/* <Button mode="contained" onPress={()=> cleanupImages()}>REMOVE</Button> */}
              </Card.Actions>
          </Card>
      );
  }

  const cleanupImages = () => {
      ImagePicker.clean().then(() => {
          setVisitSelfie(null)
      }).catch(e => {
          alert(e);
      });
  }
  const launchCamera = () => {
      ImagePicker.openCamera({
          compressImageQuality: 0.1,
          cropping: false,
          includeBase64: true
      }).then(response => {
          if (!response.didCancel && !response.error) {
              const source = 'data:image/jpeg;base64,' + response.data;
              setVisitSelfie(source)
              onSavePhoto(source);
          }
      }).catch(e => alert('ANDA BELUM MENGAMBIL GAMBAR'));
  }

  const onGoBack = () => {
    loadData();
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
  
  const onMore = (value) => {
    const currentIndex = open.indexOf(value);
    const newChecked = [...open];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setOpen(newChecked);
  }

  useEffect(() => {
    getPosition()
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
        loadData()
    });
    setIsLoading(false)
    return () => interactionPromise.cancel();
  },[])
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const detaildata = collectiondetail ? collectiondetail.cust_detail : [];
  const listar = collectiondetail ? collectiondetail.list_ar : [];
  const statusar = collectiondetail ? collectiondetail.status_ar : [];
  // const dateinput1 = new Date(detaildata.tgl_transfer) == null ? input1.date : new Date(detaildata.tgl_transfer);
  const dateinput1 = detaildata.tgl_transfer == null ? input1.date : new Date(detaildata.tgl_transfer);
  // const dateinput2 = input2.date != new Date(detaildata.tgl_pencairan_giro) ? new Date(detaildata.tgl_pencairan_giro) : input2.date;
  const dateinput2 = detaildata.tgl_pencairan_giro == null ? input2.date :new Date(detaildata.tgl_pencairan_giro);
  const pickdate1 = input1.date == input1.pickDate ? input1.pickDate : dateinput1;
  const pickdate2 = input2.date == input2.pickDate ? input2.pickDate : dateinput2;
  // const trans = [mountTunai+mountTransfer+mountGiro];
  // console.log(input1.date == new Date(detaildata.tgl_transfer))
  // console.log (dateinput1);
  // console.log('-');
  // console.log(pickdate1);
  return (
    <View style={{flex:1}}>
    <Appbar.Header>
        <Appbar.BackAction onPress={() => onBackz()} />
        <Appbar.Content title={'LIST TAGIHAN'} />
    </Appbar.Header>
    <ScrollView
        style={{flex:1}}
        showsVerticalScrollIndicator={false}
        horizontal={false}
    >
    <Loading loading={isLoading} /> 
      <View style={{ paddingHorizontal: 10, paddingTop: 10}}>
        <View style={{marginTop: 10, paddingBottom: 10}} flexDirection="row">
              { visitSelfie != null || detaildata.image_visit != null ?
                   renderAsset(detaildata.image_visit)
                   :
                  (
                  <TouchableHighlight
                      onPress={launchCamera}
                      style={{ backgroundColor: 'white', width: '100%', borderRadius: 10}} 
                      activeOpacity={0.8} 
                      underlayColor="#bbbcbd"  
                  >
                      <View style={{minHeight: 180, backgroundColor: 'grey', borderRadius: 10, width: '100%'}} alignItems="center" justifyContent="center">
                          <Text title="UPLOAD FOTO" style={{color: '#FFFF'}} bold h2 />
                          <Text title="SELFIE" style={{color: '#FFFF'}} bold h2 />
                      </View>
                  </TouchableHighlight>
                  )
              }
        </View>
        <Card style={{ alignItems: 'center' }}>
          <Card.Content
            style={{boxShadow: '0px 3px 5px -1px rgba(80,80,80, 0.2),0px 5px 8px 0px rgba(80,80,80, 0.14),0px 1px 14px 0px rgba(80,80,80, 0.12)', shadowColor: '#easade',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            elevation: 1
            }}
          >
          <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
              <Text title=" " />
            <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
              {detaildata.job_status == 1 ?
                <Text 
                  title={'DRAFT'} bold style={{ color: 'grey' }}
                />
                :
                (
                  <>
                  {detaildata.collection_status == 'tertagih' &&
                    <Text 
                      title={'TERTAGIH'} bold style={{ color: 'green' }}
                    />
                  }
                  {detaildata.collection_status == 'tidak_tertagih' &&
                    <Text 
                      title={'TIDAK TERTAGIH'} bold style={{ color: 'grey' }}
                    />
                  }
                  {detaildata.collection_status == 'tukar_faktur' &&
                    <Text 
                      title={'TUKAR FAKTUR'} bold style={{ color: 'green' }}
                    />
                  }
                  {detaildata.collection_status == 'toko_tutup' &&
                    <Text 
                      title={'TOKO TUTUP'} bold style={{ color: 'red' }}
                    />
                  }
                  {detaildata.collection_status == 'tidak_ada_pic' &&
                    <Text 
                      title={'TIDAK ADA PIC'} bold style={{ color: 'red' }}
                    />
                  }
                  {detaildata.collection_status == 'janji_pembayaran' &&
                    <Text 
                      title={'JANJI PEMBAYARAN'} bold style={{ color: 'red' }}
                    />
                  }
                  {detaildata.collection_status == 'waktu_tidak_cukup' &&
                    <Text 
                      title={'WAKTU TIDAK CUKUP'} bold style={{ color: 'red' }}
                    />
                  }
                  {detaildata.collection_status == null &&
                    <Text 
                      title={'BELUM DI KUNJUNGI'} bold style={{ color: 'grey' }}
                    />
                  }
                  </>
                )
              }
            </View>
          </View>
            <Title 
              style={{color: '#000000', fontWeight: 'bold'}}
            >
              {detaildata.cust_name}
            </Title>
          <View style={{ marginTop: 10 }} />
          <Paragraph>{detaildata.bill_to_address}</Paragraph>
          <View style={{ marginTop: 10 }} />
          <Text title={`Catatan : ${detaildata.catatan_collection ? detaildata.catatan_collection : '-'}`} />
          </Card.Content>
        </Card>
      </View>
      <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 }}>     
        <Card>
          <Card.Content>
            <Text
              title="List Tagihan" 
              h5 bold style={{color: '#000000'}} 
            />
            
            { listar?.map((item, index) => {
              total_tagihan += item.amount_due_remaining
              total_transfer += item.amount_payment_transfer;
              total_tunai += item.amount_payment_tunai;
              total_giro += item.amount_payment_giro;
              total_sisa += item.sisa_payment;
              total_bayar += item.total_payment;

              totTunai = mountTunai != '0' ? mountTunai : total_tunai;
              totTransfer = mountTransfer != '0' ? mountTransfer : total_transfer;
              totGiro = mountGiro != '0' ? mountGiro : total_giro;

              trans = totTunai + totTransfer + totGiro;
              total_pembayaran =  total_bayar == '0' ? trans : total_bayar;
              !jobstatus ? (jobstatus = item.job_status == 2 && true ) : false;
              return (
                <React.Fragment
                  key={index.toString()}
                >
                  { (index == 0) &&
                    <>
                    <List.Item
                      style={[ item.job_status <= 1 ? {backgroundColor: '#FFFF'} : {backgroundColor: '#C8C8C8'}]}
                      // title={`No. AR ${item.trx_number} - ${[ item.job_status == 1 ? 'ON DRAFT' : '']}`}
                      title={`No. AR ${item.trx_number}`}
                      key={index.toString()}
                      description={props => 
                        <NumberFormat 
                          value={item.amount_due_remaining} 
                          displayType={'text'} 
                          prefix={`Nominal Rp. `} 
                          thousandSeparator={true}
                          renderText={(value) =>  {
                              return (
                                  <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                                      <Text title={value} italic />
                                  </View>
                              )
                          }}
                        />
                      }
                      left={props => <List.Icon {...props} icon="chevron-double-right" />}
                      onPress={() => navigation.push('CollectionPayment', {data: item, onBack: () => onGoBack()})}
                    />
                    <View style={{borderColor: 'grey', borderWidth: .5}} />
                    </>
                  }
                    { expanded == 0 &&
                      <>
                      { (index >= 1) &&
                      <List.Item
                        style={[ item.job_status <= 1 ? {backgroundColor: '#FFFF'} : {backgroundColor: '#C8C8C8'}]}
                        title={`No. AR ${item.trx_number}`}
                        key={index.toString()}
                        description={props => 
                          <NumberFormat 
                            value={item.amount_due_remaining} 
                            displayType={'text'} 
                            prefix={`Nominal Rp. `} 
                            thousandSeparator={true}
                            renderText={(value) =>  {
                                return (
                                    <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                                        <Text title={value} italic />
                                    </View>
                                )
                            }}
                          />
                        }
                        left={props => <List.Icon {...props} icon="chevron-double-right" />}
                        onPress={() => navigation.push('CollectionPayment', {data: item, onBack: () => onGoBack()})}
                      />
                    }
                    <View style={{borderColor: 'grey', borderWidth: .5}} />
                    </>
                  }
                  { listar.length > 1 ?
                      [index == 0 && (
                        <>
                          <Button icon={expanded != 0 ? 'arrow-down-thick' : 'arrow-up-thick'} mode='text' onPress={() => setExpanded(!expanded)}>
                            {expanded != 0 ? 'More Detail' : 'Less More'}
                          </Button>
                        <View style={{borderColor: 'grey', borderWidth: .5}} />
                        </>
                      )]
                    :
                      null
                  }
                </React.Fragment>
                
              )
            })}
            <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
              
              <Text title={'Total Tagihan'} h5 bold style={{ paddingTop: 8 }} />
              <NumberFormat 
                  value={total_tagihan} 
                  displayType={'text'} 
                  prefix={`Rp. `} 
                  thousandSeparator={true}
                  renderText={(value) =>  {
                      return (
                          <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                          <TouchableOpacity onPress={() => {
                            Clipboard.setString(`${total_tagihan}`)
                            Toast.show('Sudah di salin.');
                            }} >
                            <Text title={value} h5 bold />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                            Clipboard.setString(`${total_tagihan}`)
                            Toast.show('Sudah di salin.');
                            }} >
                              <IconButton 
                                icon="content-copy"
                                iconColor="blue"
                                size={15}                
                              />
                          </TouchableOpacity>
                          </View>
                      )
                  }}
              />
            </View>
            { detaildata.job_status >= 2 &&
            <React.Fragment>              
              { total_tunai != '0' &&
                <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
                  <Text title={'Jumlah Semua Tunai'} h5 bold />
                  <NumberFormat 
                      value={total_tunai}
                      displayType={'text'}
                      prefix={`Rp. `}
                      thousandSeparator={true}
                      renderText={(value) =>  {
                          return (
                              <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                                  <Text title={value? value : '0'} h5 bold />
                              </View>
                          )
                      }}
                  />
                </View>
              }
              { total_transfer != '0' &&
                <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
                  <Text title={'Jumlah Semua Transfer'} h5 bold />
                  <NumberFormat 
                      value={total_transfer}
                      displayType={'text'}
                      prefix={`Rp. `}
                      thousandSeparator={true}
                      renderText={(value) =>  {
                          return (
                              <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                                  <Text title={value? value : '0'} h5 bold />
                              </View>
                          )
                      }}
                  />
                </View>
              }
              { total_giro != '0' &&
                <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
                  <Text title={'Jumlah Semua Giro'} h5 bold />
                  <NumberFormat 
                      value={total_giro}
                      displayType={'text'}
                      prefix={`Rp. `}
                      thousandSeparator={true}
                      renderText={(value) =>  {
                          return (
                              <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                                  <Text title={value? value : '0'} h5 bold />
                              </View>
                          )
                      }}
                  />
                </View>
              }
              <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
                <Text title={'Sisa Semua Tagihan'} h5 bold />
                <NumberFormat 
                    value={total_sisa}
                    displayType={'text'}
                    prefix={`Rp. `}
                    thousandSeparator={true}
                    renderText={(value) =>  {
                        return (
                            <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                                <Text title={value? value : '0'} h5 bold />
                            </View>
                        )
                    }}
                />
              </View>
            </React.Fragment>
            }
          </Card.Content>
        </Card>         
      </View>
      {/* { detaildata.job_status <= 1 && detaildata.collection_status == null &&  */}
      { detaildata.job_status <= 2 && 
      <React.Fragment>
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Card>
          <Card.Content>
            <Text
              title="Status Tagihan" 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>
              <Controller
                  defaultValue={detaildata?.collection_status}
                  name="status_tagihan"
                  control={control}
                  rules={{ required: { value: true, message: 'Status harus di pilih' } }}
                  render={({field: { onChange, value, onBlur }}) => (
                      <SelectPicker
                          items = {[
                                      { label: 'Tertagih', value: 'tertagih' },
                                      { label: 'Tidak Tertagih', value: 'tidak_tertagih' },
                                      { label: 'Tukar Faktur', value: 'tukar_faktur' },
                                      { label: 'Toko Tutup', value: 'toko_tutup' },
                                      { label: 'Tidak Ada PIC', value: 'tidak_ada_pic' },
                                      { label: 'Janji Pembayaran', value: 'janji_pembayaran' },
                                      { label: 'Waktu Tidak Cukup', value: 'waktu_tidak_cukup' },
                                  ]}
                          onDataChange={(value) => {
                            onChange(value);
                            setStatusTagihan(value);
                          }}
                          placeholder="STATUS TAGIHAN"
                          value={value}
                          onBlur={onBlur}
                          error={errors?.status_tagihan}
                          errorText={errors?.status_tagihan?.message}
                      />         
                  )}
            />
          </View>
          </Card.Content>
        </Card>
      </View>
      { !jobstatus &&
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Card>
          <Card.Content>             
            <Text
              title="Pembayaran Semua Tagihan" 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>
              <View style={{marginTop: 15}} />  
              <View style={{borderColor: 'grey', borderWidth: .5}} />   
              <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
                  <Text title=" " />
                  <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                      <Text title="TUNAI" bold />
                  </View>
              </View>
              <Text title="Nominal Pembayaran Tunai" />
                <Controller
                    // BAYAR TUNAI
                    defaultValue={`${totTunai}`}
                    name="nominal_payment_tunai"
                    control={control}
                    // rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                    render={({field: { onChange, value, onBlur }}) => ( 
                      <Input
                          error={errors?.nominal_payment_tunai}
                          errorText={errors?.nominal_payment_tunai?.message}
                          onChangeText={(text) => {
                            setMountTunai(parseInt(removeCommas(text)));
                            onChange(addCommas(removeNonNumeric(text)))
                          }}
                          value={addCommas(removeNonNumeric(value))}
                          placeholder="NOMINAL PEMBAYARAN TUNAI"
                          onBlur={onBlur}
                      />
                    )}
                />    
                <View style={{marginTop: 15}} /> 
                <View style={{borderColor: 'grey', borderWidth: .5}} />   
                <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
                    <Text title=" " />
                    <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                        <Text title="TRANSFER" bold />
                    </View>
                </View>
                <View style={{marginTop: 15}} />
                <Text title="Tanggal Transfer" />
                    <Controller
                        // defaultValue={dateinput1}
                        name="transfer_date"
                        control={control}
                        // rules={{ required: { value: true, message: 'Tanggal kunjungan harus diisi' } }}
                        render={({ field: {onChange, value, onBlur} }) => {
                          // console.log(dateinput1)
                          // console.log(new Date())
                          // console.log('test')
                          // console.log(input1.pickDate)
                          return (
                          <>                                 
                            <View flexDirection="row" justifyContent="space-between" style={{ borderColor: 'grey', borderWidth: 0 }}>
                              {input1.show && (
                                  <DateTimePicker
                                      testID="dateTimePicker1"
                                      value={new Date(pickdate1)}
                                      mode={'date'}
                                      format="YYYY-MM-DD"
                                      display="default"
                                      onChange={input1.onChangeDate}
                                  />
                              )}
                              <Text 
                                title={moment(pickdate1).format('YYYY-MM-DD')}
                                style={{ paddingTop: '9%', paddingLeft: '35%', fontSize: 15 }}
                                onPress={input1.showDatepicker}
                              />
                              <IconButton
                                icon="calendar-range"
                                color={Colors.red400}
                                size={35}
                                onPress={input1.showDatepicker}
                                style={{ paddingTop: 20, color: '#F3114B'}}
                              />
                            </View>
                            <View style={{borderColor: theme.colors.primary, borderWidth: 1}} />  
                          </>
                        )}}
                    />
                    {/* <Controller
                        defaultValue={moment(new Date()).format('YYYY-MM-DD')}
                        name="transfer_date"
                        control={control}
                        rules={{ required: { value: true, message: 'Tanggal transfer harus diisi' } }}                          
                        render={({ field: {onChange, value, onBlur} }) => (
                            // <DatePicker
                            //     style={styles.datePickerStyle}
                            //     date={value} // Initial date from state
                            //     mode="date" // The enum of date, datetime and time
                            //     format="YYYY-MM-DD"
                            //     value={date}
                            //     error={errors.transfer_date}
                            //     errorText={errors?.transfer_date?.message}
                            //     onDateChange={(data) => { onChange(data) }}
                            // />
                            <Input
                              error={errors?.transfer_date}
                              errorText={errors?.transfer_date?.message}
                              onChangeText={(text) => {
                                // setMountTransfer(parseInt(text));
                                onChange(text);
                                // setMountTransfer(text);
                              }}
                              value={value}
                              placeholder="TANGGAL PEMBAYARAN CTH: 2022-07-28"
                          />
                        )}
                    /> */}
                <View style={{marginTop: 15}} />  
                <Text title="Nominal Pembayaran Transfer" />
                  <Controller
                      defaultValue={`${total_transfer}`}
                      name="nominal_payment_transfer"
                      control={control}
                      // rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                      render={({field: { onChange, value }}) => ( 
                        <Input
                            error={errors?.nominal_payment_transfer}
                            errorText={errors?.nominal_payment_transfer?.message}
                            onChangeText={(text) => {
                              setMountTransfer(parseInt(removeCommas(text)));
                              onChange(addCommas(removeNonNumeric(text)))
                            }}
                            value={addCommas(removeNonNumeric(value))}
                            placeholder="NOMINAL PEMBAYARAN TRANSFER"
                        />
                      )}
                  />
                <View style={{marginTop: 15}} />  
                <View style={{borderColor: 'grey', borderWidth: .5}} /> 
                <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
                    <Text title=" " />
                    <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                        <Text title="GIRO" bold />
                    </View>
                </View>
                <Text title="No. Giro" />
                  <Controller
                      defaultValue={detaildata?.giro_number}
                      name="no_giro"
                      control={control}
                      // rules={{ required: { value: true, message: 'Nomor Giro Harus Di isi' } }}
                      render={({field: { onChange, value, onBlur }}) => (
                      <Input
                          onChangeText={(text) => {onChange(text)}}
                          value={value}
                          placeholder="NO. GIRO - CTH 'BCA - XXXXXX'"
                          error={errors?.no_giro}
                          errorText={errors?.no_giro?.message}
                      />
                    )}
                  />
                <View style={{marginTop: 15}} />
                <Text title="Tanggal Pencairan Giro" />
                    <Controller
                        // defaultValue={dateinput1}
                        name="giro_date"
                        control={control}
                        // rules={{ required: { value: true, message: 'Tanggal kunjungan harus diisi' } }}
                        render={({ field: {onChange, value, onBlur} }) => {
                          return (
                          <>                                 
                            <View flexDirection="row" justifyContent="space-between" style={{ borderColor: 'grey', borderWidth: 0 }}>
                              {input2.show && (
                                  <DateTimePicker
                                      testID="dateTimePicker1"
                                      value={new Date(pickdate2)}
                                      mode={'date'}
                                      format="YYYY-MM-DD"
                                      display="default"
                                      onChange={input2.onChangeDate}
                                  />
                              )}
                              <Text 
                                title={moment(pickdate2).format('YYYY-MM-DD')}
                                style={{ paddingTop: '9%', paddingLeft: '35%', fontSize: 15 }}
                                onPress={input2.showDatepicker}
                              />
                              <IconButton
                                icon="calendar-range"
                                color={Colors.red400}
                                size={35}
                                onPress={input2.showDatepicker}
                                style={{ paddingTop: 20, color: '#F3114B'}}
                              />
                            </View>
                            <View style={{borderColor: theme.colors.primary, borderWidth: 1}} />  
                          </>
                        )}}
                    />
                <View style={{marginTop: 15}} />
                <Text title="Nominal Pembayaran Giro" />
                    <Controller
                        defaultValue={`${total_giro}`}
                        name="nominal_payment_giro"
                        control={control}
                        // rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                        render={({field: { onChange, value }}) => (
                          <Input
                              onChangeText={(text) => {
                                setMountGiro(parseInt(removeCommas(text)));
                                onChange(addCommas(removeNonNumeric(text)))
                              }}
                              value={addCommas(removeNonNumeric(value))}
                              placeholder="NOMINAL PEMBAYARAN GIRO"
                              error={errors?.nominal_payment_giro}
                              errorText={errors?.nominal_payment_giro?.message}
                          />
                        )}
                    />
          </View>
          </Card.Content>
        </Card>
      </View>
      }      
      { !jobstatus &&
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Card>
          <Card.Content>             
            <Text
              title={"Total Pembayaran"} 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>
            <Controller
                defaultValue={`${total_pembayaran}`}
                name="total_payment"
                control={control}
                // rules={{ required: { value: true, message: 'Total pembayaran harus diisi' } }}
                render={({field: {onChange, value}}) => (
                  <Input
                      error={errors?.total_payment}
                      errorText={errors?.total_payment?.message}
                      onChangeText={(text) => {onChange(text)}}
                      value={`${addCommas(removeNonNumeric(~~total_pembayaran))}`}
                      placeholder="TOTAL PEMBAYARAN"
                      disabled
                  />
                )}
            />
          </View>
          </Card.Content>
        </Card>
      </View>
      }
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Card>
          <Card.Content>             
            <Text
              title="Catatan Collection" 
              h5 bold style={{color: '#000000'}} 
            />        
            <Controller
                defaultValue={detaildata?.catatan_collection}
                name="catatan_collection"
                control={control}
                rules={{ required: { value: true, message: 'Catatan collection harus diisi' } }}
                render={({ field: {onChange, value, onBlur} }) => (
                    <Input
                        error={errors?.catatan_collection}
                        errorText={errors?.catatan_collection?.message}
                        onChangeText={(text) => {onChange(text)}}
                        value={value}
                        onBlur={onBlur}
                        multiline={true}
                        placeholder="CATATAN COLLECTION"
                    />
                )}
            />    
          <View style={{width: '100%', paddingTop: '2%'}}>
          </View>
          </Card.Content>
        </Card>
        <View style={{width: '100%', paddingTop: 10}} />
            <Button
              mode="contained"
              onPress={handleSubmit(onSaveDraft)}
              disabled={disButton} 
            >SAVE DRAFT
            </Button>
            <View style={{paddingTop: 10}} />
          { !jobstatus &&
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmitAll)}
              disabled={disButton} 
            >SUBMIT
            </Button>
          }
          { jobstatus && 
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              disabled={disButton} 
            >SUBMIT
            </Button>
          }
            <View style={{paddingTop: 10}} />
        <View style={{width: '100%', paddingBottom: '10%'}} />
      </View>
      </React.Fragment>
      }
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
    collectiondetail: state.crud.collectiondetails,
  }
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(_.assign({}, crudAction, apiAction, flashMessage, authService), dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CollectionDetail);