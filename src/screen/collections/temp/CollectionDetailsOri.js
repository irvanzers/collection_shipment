import React, { useState, useEffect, useCallback }  from 'react'
import { View, StyleSheet, ScrollView, TouchableHighlight, InteractionManager, PermissionsAndroid, Platform, Alert } from 'react-native'
import { useForm, Controller } from 'react-hook-form';

import Text from './../../components/Text';
import Input from '../../components/Input';
import SelectPicker from './../../components/SelectPicker';
import { List, Card, Title, Paragraph, Button, IconButton } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import NumberFormat from 'react-number-format';
import Collapsible from 'react-native-collapsible';
import Loading from './../../components/Loading';
import moment from 'moment';
import DatePicker from '../../components/DatePicker';
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
import { theme } from '../../redux/constants/theme';
import {getUuid, setUuid} from './../../redux/utils/actionUtil';
import { useNavigation } from '@react-navigation/core';
import { API_URL, URL } from './../../redux/constants/app';


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

let total_pembayaran = 9;

const CollectionDetail = ( props ) => {
  const {collectiondetail} = props;
  const navigation = useNavigation();
  const [text, setText] = React.useState("");
  const { handleSubmit, control, formState: {errors}, setValue, getValues } = useForm(); // initialize the hook
  const [error, setError] = useState('');
  const [visitSelfie, setVisitSelfie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jenisPayment, setJenisPayment] = useState('');
  const [position, setPosition] = useState({
      latitude: '',
      longitude: ''
  });
  const [mountTransfer, setMountTransfer] = useState(0);
  const [mountTunai, setMountTunai] = useState(0);
  const [mountGiro, setMountGiro] = useState(0);
  let jobstatus = false;
  let total_tagihan = 0;
  let total_bayar = 0;

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

  const loadData = async () => {
    setIsLoading(false);  
      try {
          const datasubmit = {
              cust_id: props.route.params.cust_id,
              header_id: props.route.params.collection_header_id,
          }
          await props.actions.fetchAll(Common.COLLECTION_DETAIL, datasubmit);    
      } catch (error) {
          alert(error)
      } finally {
        setIsLoading(false);  
      }
  }

  const onSubmit = async(data) => {
    try {
      // if(visitSelfie == null){
      //     checkSelfie()
      //     return true;
      // }
      setIsLoading(true)
      data['payment_all_ar'] = true;
      data['cust_id'] = detaildata.cust_id;
      data['header_id'] = detaildata.collection_header_id;
      data['visit_date'] = moment(new Date()).format('YYYY-MM-DD');
      data['visit_lat'] = position.latitude;
      data['visit_long'] = position.longitude;
      data['total_payment'] = total_pembayaran;
      data['job_status'] = '2';
      const updatePay = await props.actions.storeItem(Common.UPDATE_COLLECTION_PAYMENT, data);
      // console.log(updatePay.success);
      if(updatePay.success){
          // await props.actions.fetchAll(Common.USER_PROFILE);
          Toast.show('Pembayaran berhasil disimpan');
          props.navigation.goBack();
      }
      // console.log(data)
    } catch (error) {
      alert(error)
    }
  }
  
  const onSaveDraft = async(data) => {
    try {
      // if(visitSelfie == null){
      //     checkSelfie()
      //     return true;
      // }
      // setIsLoading(true)
      data['payment_all_ar'] = true;
      data['cust_id'] = detaildata.cust_id;
      data['header_id'] = detaildata.collection_header_id;
      data['visit_date'] = moment(new Date()).format('YYYY-MM-DD');
      data['visit_lat'] = position.latitude;
      data['visit_long'] = position.longitude;
      data['total_payment'] = total_pembayaran;
      data['job_status'] = '1';
      // const updatePay = await props.actions.storeItem(Common.UPDATE_COLLECTION_PAYMENT, data);
      // if(updatePay.success){
      //     // await props.actions.fetchAll(Common.USER_PROFILE);
      //     Toast.show('Pembayaran berhasil disimpan');
      //     props.navigation.goBack();
      // }
      console.log(data)
    } catch (error) {
      alert(error)
    }
  }

  const onSavePhoto = async(source) => {
    try {
      // console.log(visitSelfie)
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
      // console.log(datasubmit)
      const updatePay = await props.actions.storeItem(Common.UPDATE_COLLECTION_PAYMENT, datasubmit);
      if(updatePay.success){
          // await props.actions.fetchAll(Common.USER_PROFILE);
          Toast.show('Foto berhasil disimpan');
          // props.navigation.goBack();
      }
    } catch (error) {
      alert(error)
    }
  }

  //GETTING PHOTO
  const renderAsset = (visitSelfie) => {
      return (
          <Card style={{ width: '100%' }}>
              <Card.Cover source={{uri: visitSelfie}} style={{ height: 300 }} />
              <Card.Actions style={{justifyContent: 'center'}}>
                  <Button mode="contained" onPress={()=> cleanupImages()}>REMOVE</Button>
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
          // console.log(pos)
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
  const detaildata = collectiondetail ? collectiondetail.cust_detail : [];
  const listar = collectiondetail ? collectiondetail.list_ar : [];
  const statusar = collectiondetail ? collectiondetail.status_ar : [];
  const trans = mountTunai+mountTransfer+mountGiro;
  // console.log(visitSelfie)

  return (
    <View style={{flex:1}}>
    <ScrollView
        style={{flex:1}}
        showsVerticalScrollIndicator={false}
        horizontal={false}
    >
    <Loading loading={isLoading} /> 
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <View style={{marginTop: 10, paddingBottom: 10}} flexDirection="row">          
          {/* {detaildata.image_visit != null ? 
            <Card style={{ width: '100%' }}>
                <Card.Cover source={{uri: `${URL}${detaildata.image_visit}`}} style={{ height: 300 }} />
                <Card.Actions style={{justifyContent: 'center'}}>
                    <Button mode="contained" onPress={()=> cleanupImages()}>REMOVE</Button>
                </Card.Actions>
            </Card>
            :(
              <> */}
              { visitSelfie != null ?
                  renderAsset(visitSelfie)
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
              {/* </>
            )
          } */}
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
                  {detaildata.collection_status == 'toko_tutup' &&
                    <Text 
                      title={'TOKO TUTUP'} bold style={{ color: 'red' }}
                    />
                  }
                  {detaildata.collection_status == 'tidak_ada_dana' &&
                    <Text 
                      title={'TIDAK ADA DANA'} bold style={{ color: 'red' }}
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
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>     
        <Card>
          <Card.Content>
            <Text
              title="List Tagihan" 
              h5 bold style={{color: '#000000'}} 
            />                
            { listar != undefined && listar?.map((item, index) => {
              total_tagihan += item.amount_due_remaining
              total_bayar += item.total_payment
              total_pembayaran =  total_bayar == '0' ? trans : total_bayar;
              !jobstatus ? (jobstatus = item.job_status == 2 && true ) : false
              return (
                <React.Fragment
                  key={index.toString()}
                >
                {
                  item.job_status <= 1 &&
                    <>
                    <List.Item
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
                        />}
                      left={props => <List.Icon {...props} icon="chevron-double-right" />}
                      onPress={() => navigation.navigate('CollectionPayment', {data: item, onBack: () => onGoBack()})}
                    />    
                    <View style={{borderColor: 'grey', borderWidth: .5}} />
                    </>
                }       
                {
                  item.job_status == 2 &&
                  <>
                    <List.Item
                      style={{backgroundColor: '#C8C8C8'}}
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
                        />}
                      left={props => <List.Icon {...props} icon="chevron-double-right" />}
                      onPress={() => navigation.push('CollectionPayment', {data: item})}
                    />
                    <View style={{borderColor: 'grey', borderWidth: .5}} />    
                  </>
                }
                </React.Fragment>
              )
            })}
            <View style={{borderColor: 'grey', borderWidth: .5}} />
            <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
              <Text title={'Total Tagihan'} h5 bold />
              <NumberFormat 
                  value={total_tagihan} 
                  displayType={'text'} 
                  prefix={`Rp. `} 
                  thousandSeparator={true}
                  renderText={(value) =>  {
                      return (
                          <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                              <Text title={value} h5 bold />
                          </View>
                      )
                  }}
              />
            </View>
            { detaildata.collection_status != null &&
            <React.Fragment>              
              { detaildata.amount_payment_tunai != '0' &&
                <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
                  <Text title={'Jumlah Tunai'} h5 bold />
                  <NumberFormat 
                      value={detaildata.amount_payment_tunai}
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
              { detaildata.amount_payment_transfer != '0' &&
                <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
                  <Text title={'Jumlah Transfer'} h5 bold />
                  <NumberFormat 
                      value={detaildata.amount_payment_transfer}
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
              { detaildata.amount_payment_giro != '0' &&
                <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
                  <Text title={'Jumlah Giro'} h5 bold />
                  <NumberFormat 
                      value={detaildata.amount_payment_giro}
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
                <Text title={'Sisa Tagihan'} h5 bold />
                <NumberFormat 
                    value={detaildata.sisa_payment}
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
      { detaildata.job_status <= 1 && 
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
                                      { label: 'Toko Tutup', value: 'toko_tutup' },
                                      { label: 'Tidak Ada PIC', value: 'tidak_ada_pic' },
                                      { label: 'Janji Pembayaran', value: 'janji_pembayaran' },
                                      { label: 'Waktu Tidak Cukup', value: 'waktu_tidak_cukup' },
                                  ]}
                          onDataChange={(value) => onChange(value)}
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
                        <Text title="TRANSFER" bold />
                    </View>
                </View>
                <Text title="No. Rekening" />
                  <Controller
                      defaultValue={listar?.nomor_rekening}
                      name="nomor_rekening"
                      control={control}
                      // rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                      render={({field: { onChange, value }}) => ( 
                        <Input
                            error={errors?.nomor_rekening}
                            errorText={errors?.nomor_rekening?.message}
                            onChangeText={(text) => {onChange(text)}}
                            value={value}
                            placeholder="NO. REKENING"
                        />
                      )}
                  />
                  <View style={{marginTop: 15}} />
                  <Text title="Tanggal Transfer" />
                      <Controller
                          defaultValue={moment(new Date()).format('YYYY-MM-DD')}
                          name="transfer_date"
                          control={control}
                          rules={{ required: { value: true, message: 'Tanggal transfer harus diisi' } }}
                          render={({ onChange, value }) => (
                              <DatePicker
                                  style={styles.datePickerStyle}
                                  date={value} // Initial date from state
                                  mode="date" // The enum of date, datetime and time
                                  format="YYYY-MM-DD"
                                  value={value}
                                  error={errors.transfer_date}
                                  errorText={errors?.transfer_date?.message}
                                  onDateChange={(data) => { onChange(data) }}
                              />
                          )}
                      />
                <View style={{marginTop: 15}} />  
                <Text title="Nominal Pembayaran Transfer" />
                  <Controller
                      defaultValue={listar?.amount_payment_transfer}
                      name="nominal_payment_transfer"
                      control={control}
                      // rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                      render={({field: { onChange, value }}) => ( 
                        <Input
                            error={errors?.nominal_payment_transfer}
                            errorText={errors?.nominal_payment_transfer?.message}
                            onChangeText={(text) => {
                              setMountTransfer(parseInt(text));
                              onChange(text)
                            }}
                            value={value}
                            placeholder="NOMINAL PEMBAYARAN"
                        />
                      )}
                  />
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
                    defaultValue={listar?.amount_payment_tunai}
                    name="nominal_payment_tunai"
                    control={control}
                    // rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                    render={({field: { onChange, value }}) => ( 
                      <Input
                          error={errors?.nominal_payment_tunai}
                          errorText={errors?.nominal_payment_tunai?.message}
                          onChangeText={(text) => {
                            setMountTunai(parseInt(text));
                            onChange(text)
                          }}
                          value={value}
                          placeholder="NOMINAL PEMBAYARAN"
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
                      defaultValue={listar?.giro_number}
                      name="no_giro"
                      control={control}
                      // rules={{ required: { value: true, message: 'Nomor Giro Harus Di isi' } }}
                      render={({field: { onChange, value, onBlur }}) => (
                      <Input
                          onChangeText={(text) => {onChange(text)}}
                          value={value}
                          placeholder="NO. GIRO"
                          error={errors?.no_giro}
                          errorText={errors?.no_giro?.message}
                      />
                    )}
                  />
                <View style={{marginTop: 15}} />
                <Text title="Tanggal Pencairan Giro" />
                    <Controller
                        defaultValue={moment(new Date()).format('YYYY-MM-DD')}
                        name="giro_date"
                        control={control}
                        // rules={{ required: { value: true, message: 'Tanggal pencairan giro harus diisi' } }}
                        render={({ onChange, value }) => (
                            <DatePicker
                                style={styles.datePickerStyle}
                                date={value} // Initial date from state
                                mode="date" // The enum of date, datetime and time
                                format="YYYY-MM-DD"
                                value={value}
                                error={errors.giro_date}
                                errorText={errors?.giro_date?.message}
                                onDateChange={(data) => { onChange(data) }}
                            />
                        )}
                    />
                <View style={{marginTop: 15}} />
                <Text title="Nominal Pembayaran Giro" />
                    <Controller
                        defaultValue={listar?.amount_payment_giro}
                        name="nominal_payment_giro"
                        control={control}
                        // rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                        render={({field: { onChange, value }}) => (
                          <Input
                              onChangeText={(text) => {
                                setMountGiro(parseInt(text))
                                onChange(text)
                              }}
                              value={value}
                              placeholder="NOMINAL PEMBAYARAN"
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
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Card>
          <Card.Content>             
            <Text
              title={"Total Pembayaran"} 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>
            <Controller
                defaultValue={listar?.total_payment}
                name="total_payment"
                control={control}
                // rules={{ required: { value: true, message: 'Total pembayaran harus diisi' } }}
                render={({field: {onChange, value}}) => (
                  <Input
                      error={errors?.total_payment}
                      errorText={errors?.total_payment?.message}
                      onChangeText={(text) => {onChange(text)}}
                      value={`${~~total_pembayaran}`}
                      placeholder="TOTAL PEMBAYARAN"
                      disabled
                  />
                )}
            />
          </View>
          </Card.Content>
        </Card>
      </View>
      {/* <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Card>
          <Card.Content>             
            <Text
              title="Sisa Pembayaran" 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>
            <Controller
                defaultValue=""
                name="sisa_pembayaran"
                control={control}
                rules={{ required: { value: true, message: 'Sisa pembayaran harus diisi' } }}
                render={({ field: {onChange, value} }) => (
                    <Input
                        error={errors?.sisa_pembayaran}
                        errorText={errors?.sisa_pembayaran?.message}
                        onChangeText={(text) => {onChange(text)}}
                        value={value}
                        placeholder="SISA PEMBAYARAN"
                    />
                )}
            />
          </View>
          </Card.Content>
        </Card>
      </View> */}
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
            >SAVE DRAFT
            </Button>
            <View style={{paddingTop: 10}} />
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}  
            >SUBMIT
            </Button>
            <View style={{paddingTop: 10}} />
            {/* <Button
              mode="contained"
              onPress={handleSubmit(onSavePhoto)}  
            >SAVE PHOTO
            </Button> */}
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