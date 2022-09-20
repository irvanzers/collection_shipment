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
import Clipboard from '@react-native-clipboard/clipboard';
import ImagePicker from 'react-native-image-crop-picker';

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

const ShipmentDetail = ( props ) => {
  const itemDet = props.route.params.item;
  const {shipmentdetail} = props;
  const navigation = useNavigation();
  const [text, setText] = React.useState("");
  const { handleSubmit, control, formState: {errors}, setValue, getValues } = useForm(); // initialize the hook
  const [open, setOpen] = useState([]);
  const [expanded, setExpanded] = useState(1);
  const [visitSelfie, setVisitSelfie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusPengiriman, setStatusPengiriman] = useState('');
  const [disButton, setDisButton] = useState(false);
  const [position, setPosition] = useState({
      latitude: '',
      longitude: ''
  });
  const ROOT_URL = 'https://egis.galenium.com/v1/';

  
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
              delivery_id: itemDet?.delivery_id,
              header_id: itemDet?.header_id,
              cust_id: itemDet?.cust_id,
          }
          // console.log(itemDet)
          await props.actions.fetchAll(Common.SHIPMENT_DETAIL, datasubmit); 
      } catch (error) {
          alert(error)
      } finally {
        setIsLoading(false);  
        setDisButton(false);  
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
      datasubmit['shipment_photos'] = true;
      datasubmit['header_id'] = detaildata.header_id;
      datasubmit['cust_id'] = detaildata.cust_id;
      datasubmit['visit_date'] = moment(new Date()).format('YYYY-MM-DD');
      datasubmit['visit_selfie'] = source;
      const updatePay = await props.actions.storeItem(Common.SUBMIT_SHIPMENT, datasubmit);
      if(updatePay.success){
          // await props.actions.fetchAll(Common.USER_PROFILE);
          Toast.show('Foto berhasil disimpan');
          loadData()
      }
      // console.log(datasubmit);
    } catch (error) {
      alert(error)
    }
  }
  
  const onSubmit = async(data) => {
    try {
      let datasubmit = {};
      if(detaildata.image_visit == null){
          checkSelfie()
          return true;
      }
      // setIsLoading(true)
      data['submit_shipment'] = true;
      data['header_id'] = detaildata.header_id;
      data['cust_id'] = detaildata.cust_id;
      data['visit_lat'] = position.latitude;
      data['visit_long'] = position.longitude;
      data['job_status'] = '2';
      const updatePay = await props.actions.storeItem(Common.SUBMIT_SHIPMENT, data);
      if(updatePay.success){
          // await props.actions.fetchAll(Common.USER_PROFILE);
          Toast.show('Data berhasil disimpan');
          loadData()
      }
      console.log(data);
    } catch (error) {
      alert(error)
    }
  }
  
  const onSaveDraft = async(data) => {
    try {
      let datasubmit = {};
      if(detaildata.image_visit == null){
          checkSelfie()
          return true;
      }
      // setIsLoading(true)
      data['submit_shipment'] = true;
      data['header_id'] = detaildata.header_id;
      data['delivery_id'] = detaildata.delivery_id;
      data['visit_lat'] = position.latitude;
      data['visit_long'] = position.longitude;
      data['job_status'] = '1';
      // const updatePay = await props.actions.storeItem(Common.SUBMIT_SHIPMENT, data);
      // if(updatePay.success){
      //     // await props.actions.fetchAll(Common.USER_PROFILE);
      //     Toast.show('Data berhasil disimpan');
      //     loadData()
      // }
      console.log(data);
    } catch (error) {
      alert(error)
    }
  }

  const onShipConfirm = async(data) => {
    try {
      console.log(data);
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
  const detaildata = shipmentdetail ? shipmentdetail.cust_detail : [];
  // const listproduct = shipmentdetail ? shipmentdetail.list_product : [];
  const listsj = shipmentdetail ? shipmentdetail.list_sj : [];

  return (
    <View style={{flex:1}}>
    <Appbar.Header>
        <Appbar.BackAction onPress={() => onBackz()} />
        <Appbar.Content title={'DETAIL PENGIRIMAN'} />
    </Appbar.Header>
    <ScrollView
        style={{flex:1}}
        showsVerticalScrollIndicator={false}
        horizontal={false}
    >
    <Loading loading={isLoading} /> 
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
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
          <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 8, paddingBottom: 8}}>
              {/* <Text bold title={`No. Surat Jalan ${detaildata.delivery_id}`} /> */}
              <Text title={[]} />
            <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
              {detaildata.job_status == 1 ?
                <Text 
                  title={'DRAFT'} bold style={{ color: 'grey' }}
                />
                :
                (
                  <>
                  {detaildata.shipment_status == 'terkirim' &&
                    <Text 
                      title={'TERKIRIM'} bold style={{ color: 'green' }}
                    />
                  }
                  {detaildata.shipment_status == 'tidak_terkirim' &&
                    <Text 
                      title={'TIDAK TERKIRIM'} bold style={{ color: 'red' }}
                    />
                  }
                  {detaildata.shipment_status == 'toko_tutup' &&
                    <Text 
                      title={'TOKO TUTUP'} bold style={{ color: 'red' }}
                    />
                  }
                  {detaildata.shipment_status == 'tidak_ada_pic' &&
                    <Text 
                      title={'TIDAK ADA PIC'} bold style={{ color: 'red' }}
                    />
                  }
                  {detaildata.shipment_status == 'waktu_tidak_cukup' &&
                    <Text 
                      title={'WAKTU TIDAK CUKUP'} bold style={{ color: 'red' }}
                    />
                  }
                  {detaildata.shipment_status == null &&
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
            <Paragraph>{detaildata.ship_to_address}</Paragraph>
            {detaildata.job_status == 2 &&
              <View style={{ paddingTop: 10 }}>
                <Text title={`Catatan : ${detaildata.catatan_visit}`} />
              </View>
            }
          </Card.Content>
        </Card>
      </View>
      { listsj?.map((item, index) => {
        return (
            <React.Fragment
              key={index.toString()}
            >
            <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>     
              <Card>
                <Card.Content>
                <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 8, paddingBottom: 8}}>
                    <Text
                      title="Rincian Produk" 
                      h5 bold style={{color: '#000000'}} 
                    />
                    <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                      <Text bold title={`No. Surat Jalan ${item.surat_jalan}`} style={{ fontSize: 15, paddingTop: 4 }} />
                    </View>
                  </View>
                  <View style={{marginTop: 20}}>
                    <Button icon={expanded != 0 ? 'arrow-down-thick' : 'arrow-up-thick'} mode='text' onPress={ () => setExpanded(!expanded) }>
                      { expanded != 0 ? 'More Detail' : 'Less More'}
                    </Button> 
                  </View>
                  { expanded == 0 &&
                  <>
                  { item.products.map((listprod, key) => {
                    return (
                      <React.Fragment
                        key={key.toString()}
                      >
                        <List.Item
                          title={listprod.product_name}
                          description={
                                        props =>
                                        <>
                                          <Text {...props} title={`Qty: ${listprod.product_qty}`} style={{ paddingTop: 6, color: '#797A7B' }} />
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
                  { detaildata.status_visit == 2 &&
                  <>
                    <View style={{ paddingTop: 10 }} />
                    <Button
                      mode="contained"
                      onPress={handleSubmit(onShipConfirm)}
                      disabled={disButton} 
                    >SHIP CONFIRM
                    </Button>
                  </>
                  }
                </Card.Content>
              </Card>
            </View>
            {/* <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>  
              <Card>
                <Card.Content>

                </Card.Content>
              </Card>
            </View> */}
          </React.Fragment>
        )
      })}      
      {detaildata.job_status != 2 &&
      <React.Fragment>
        <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
          <Card>
            <Card.Content>
              <Text
                title="Status Pengiriman" 
                h5 bold style={{color: '#000000'}} 
              />            
              <View style={{marginTop: 15}}>
                <Controller
                    defaultValue={detaildata?.shipment_status}
                    name="shipment_status"
                    control={control}
                    rules={{ required: { value: true, message: 'Status harus di pilih' } }}
                    render={({field: { onChange, value, onBlur }}) => (
                        <SelectPicker
                            items = {[
                                        { label: 'Terkirim', value: 'terkirim' },
                                        { label: 'Waktu Tidak Cukup', value: 'waktu_tidak_cukup' },
                                        { label: 'Toko Tutup', value: 'toko_tutup' },
                                        { label: 'Tidak Ada PIC', value: 'tidak_ada_pic' },
                                    ]}
                            onDataChange={(value) => {
                              onChange(value);
                              setStatusPengiriman(value);
                            }}
                            placeholder="STATUS PENGIRIMAN"
                            value={value}
                            onBlur={onBlur}
                            error={errors?.shipment_status}
                            errorText={errors?.shipment_status?.message}
                        />         
                    )}
              />
            </View>
            </Card.Content>
          </Card>
        </View>
        <View style={{ paddingTop: 10 }} />
        <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 }}>
          <Card>
            <Card.Content>             
              <Text
                title="Catatan" 
                h5 bold style={{color: '#000000'}} 
              />           
              <Controller
                  defaultValue=""
                  name="visit_catatan"
                  control={control}
                  rules={{ required: { value: true, message: 'Catatan pengiriman harus diisi' } }}
                  render={({field: { onChange, value, onBlur }}) => (
                      <Input
                          // error={errors.visit_catatan}
                          errorText={errors?.visit_catatan?.message}
                          onChangeText={(text) => {onChange(text)}}
                          value={value}
                          multiline={true}
                          placeholder="CATATAN PENGIRIMAN"
                      />
                  )}
              /> 
              <View style={{width: '100%', paddingTop: '3%'}} />
                  <Button
                    mode="contained"
                    onPress={handleSubmit(onSaveDraft)}
                    disabled={disButton} 
                  >SAVE DRAFT
                  </Button>
                  <View style={{paddingTop: 10}} />
                  <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    disabled={disButton} 
                  >SUBMIT
                  </Button>
                  <View style={{paddingTop: 10}} />
              <View style={{width: '100%', paddingBottom: '3%'}} />  
            </Card.Content> 
          </Card>
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
    shipmentdetail: state.crud.shipmentdetails,
  }
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(_.assign({}, crudAction, apiAction, flashMessage, authService), dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShipmentDetail);