import React, { useState, useEffect, useCallback }  from 'react'
import { View, StyleSheet, ScrollView, TouchableHighlight, InteractionManager } from 'react-native'
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
import { API_URL, URL } from './../../config/constants';


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
  let jobstatus = false;
  let total_tagihan = 0;

  const loadData = async () => {
    setIsLoading(false);  
      try {
          const datasubmit = {
              cust_id: props.route.params.cust_id
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
      if(visitSelfie == null){
          checkSelfie()
          return true;
      }
      setIsLoading(true)
      data['visit_selfie'] = visitSelfie;
      data['payment_all_ar'] = true;
      data['cust_id'] = detaildata.cust_id;
<<<<<<< HEAD
      data['visit_selfie'] = visitSelfie;
      // data['visit_lat'] = position.latitude;
      // data['visit_long'] = position.longitude;
=======
      data['visit_lat'] = position.latitude;
      data['visit_long'] = position.longitude;
>>>>>>> f6a6a596ed6a74fd1f3dd2e7113a29e98b641229
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
      if(visitSelfie == null){
          checkSelfie()
          return true;
      }
      setIsLoading(true)
      data['visit_selfie'] = visitSelfie;
      data['payment_all_ar'] = true;
      data['cust_id'] = detaildata.cust_id;
<<<<<<< HEAD
      data['visit_selfie'] = visitSelfie;
      // data['visit_lat'] = position.latitude;
      // data['visit_long'] = position.longitude;
=======
      data['visit_lat'] = position.latitude;
      data['visit_long'] = position.longitude;
>>>>>>> f6a6a596ed6a74fd1f3dd2e7113a29e98b641229
      data['job_status'] = '1';
      const updatePay = await props.actions.storeItem(Common.UPDATE_COLLECTION_PAYMENT, data);
      if(updatePay.success){
          // await props.actions.fetchAll(Common.USER_PROFILE);
          Toast.show('Pembayaran berhasil disimpan');
          props.navigation.goBack();
      }
      console.log(data)
    } catch (error) {
      alert(error)
    }
  }

  //GETTING PHOTO
  const renderAsset = (visitSelfie) => {
    // console.log(URL.visitSelfie)
      return (
          <Card style={{ width: '100%' }}>
              <Card.Cover source={{uri: visitSelfie}} style={{ height: 300 }} />
              {/* <Card.Cover source={{ uri: `${URL}${visitSelfie}` }} style={{ height: 300 }} /> */}
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
          }
      }).catch(e => alert('ANDA BELUM MENGAMBIL GAMBAR'));
  }

  const onGoBack = () => {
    loadData();
  }
  
  //GETTING POSITION LAT/LONG
  const getPosition = () => {
      Geolocation.getCurrentPosition(
      pos => {
          setPosition({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
          });
      },
          e => setError(e.message)
      );
  };

  useEffect(() => {
      const interactionPromise = InteractionManager.runAfterInteractions(() => {
          loadData()
          getPosition()
      });
      return () => interactionPromise.cancel();
  },[])
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const detaildata = collectiondetail ? collectiondetail.cust_detail : [];
  const listar = collectiondetail ? collectiondetail.list_ar : [];
  const statusar = collectiondetail ? collectiondetail.status_ar : [];
  // console.log(detaildata.image_visit)
  console.log(position.latitude)

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
        </View>
        <Card style={{ alignItems: 'center' }}>
          <Card.Content
            style={{boxShadow: '0px 3px 5px -1px rgba(80,80,80, 0.2),0px 5px 8px 0px rgba(80,80,80, 0.14),0px 1px 14px 0px rgba(80,80,80, 0.12)', shadowColor: '#easade',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            elevation: 1
            }}
          >
            <Title 
              style={{color: '#000000', fontWeight: 'bold'}}
            >
            {detaildata.cust_name}
          </Title>
          <View style={{ marginTop: 10 }} />
          <Paragraph>{detaildata.bill_to_address}</Paragraph>
          { detaildata.collection_status != null && 
            <View style={{ marginTop: 15 }}>
              <Text title={`Status Tagihan : ${detaildata.collection_status == 'tertagih' && 'TERTAGIH'}`} />
              <Text title={`Catatan : ${detaildata.catatan_collection}`} />
            </View>
          }
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
              !jobstatus ? (jobstatus = item.job_status == 2 && true ) : false
              // console.log(total_tagihan)
              return (
                <React.Fragment
                  key={index.toString()}
                >                
                {
                  item.job_status <= 1 &&
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
                }       
                {
                  item.job_status == 2 &&
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
                  prefix={`Rp`} 
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
          </Card.Content>
        </Card>         
      </View>
      { detaildata.collection_status == null && 
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
                  rules={{ required: { value: true, message: 'Payment type harus di pilih' } }}
                  render={({field: { onChange, value, onBlur }}) => (
                      <SelectPicker
                          items = {[
                                      { label: 'Toko Tutup', value: 'toko_tutup' },
                                      { label: 'Tidak Ada Faktur', value: 'tidak_ada_faktur' },
                                      { label: 'Tidak Tertagih', value: 'tidak_tertagih' },
                                      { label: 'Tertagih', value: 'tertagih' },
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
            <Text title="Metode Pambayaran" />
              <Controller
                  defaultValue={listar?.payment_type}
                  name="payment_type"
                  control={control}
                  rules={{ required: { value: true, message: 'Status tagihan harus di pilih' } }}
                  render={({field: { onChange, value, onBlur }}) => (
                    <SelectPicker
                        items = {[
                                    { label: 'Giro Bank', value: 'giro_bank' },
                                    { label: 'Transfer', value: 'transfer' },
                                    { label: 'Tunai', value: 'tunai' },
                                ]}
                        onDataChange={(value ) => {
                                                    setJenisPayment(value)
                                                    onChange(value)
                                                  }}
                        placeholder="METODE PEMBAYARAN"
                        value={value}
                        error={errors?.payment_type}
                        errorText={errors?.payment_type?.message}
                    />     
                  )}
              />         
            { jenisPayment == 'giro_bank' &&
            <>
              <View style={{marginTop: 15}} />
              <Text title="No. Giro" />
                <Controller
                    defaultValue={listar?.giro_number}
                    name="no_giro"
                    control={control}
                    rules={{ required: { value: true, message: 'Nomor Giro Harus Di isi' } }}
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
              <Text title="Tanggal Jatuh Tempo" />
                  <Controller
                      defaultValue={moment(new Date()).format('YYYY-MM-DD')}
                      name="girodate"
                      control={control}
                      rules={{ required: { value: true, message: 'Tanggal kunjungan harus diisi' } }}
                      render={({ onChange, value }) => (
                          <DatePicker
                              style={styles.datePickerStyle}
                              date={value} // Initial date from state
                              mode="date" // The enum of date, datetime and time
                              format="YYYY-MM-DD"
                              value={value}
                              error={errors.visit_date}
                              errorText={errors?.giro_date?.message}
                              onDateChange={(data) => { onChange(data) }}
                          />
                      )}
                  />
              <View style={{marginTop: 15}} />
              <Text title="Nama Bank" />
                  <Controller
                      defaultValue={listar?.bank_account}
                      name="nama_bank"
                      control={control}
                      rules={{ required: { value: true, message: 'Nama Bank Harus Di isi' } }}
                      render={({field: { onChange, value, onBlur }}) => (
                        <Input
                            onChangeText={(text) => {onChange(text)}}
                            value={value}
                            placeholder="NAMA BANK"
                            error={errors?.nama_bank}
                            errorText={errors?.nama_bank?.message}
                        />
                      )}
                  />
              <View style={{marginTop: 15}} />
              <Text title="Nominal Payment" />
                  <Controller
                      defaultValue={listar?.amount_payment}
                      name="nominal_payment"
                      control={control}
                      rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                      render={({field: { onChange, value }}) => (
                        <Input
                            onChangeText={(text) => {onChange(text)}}
                            value={value}
                            placeholder="NOMINAL PEMBAYARAN"
                            error={errors?.nominal_payment}
                            errorText={errors?.nominal_payment?.message}
                        />
                      )}
                  />
              </>
              }
              { jenisPayment == 'transfer' && 
              <>
                <View style={{marginTop: 15}} /> 
                <Text title="No. Rekening" />
                  <Controller
                      defaultValue={listar?.nomor_rekening}
                      name="nomor_rekening"
                      control={control}
                      rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
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
                <Text title="Nama Bank" />
                  <Controller
                      defaultValue={listar?.bank_account}
                      name="nama_bank"
                      control={control}
                      rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                      render={({field: { onChange, value }}) => ( 
                          <Input
                              error={errors?.nama_bank}
                              errorText={errors?.nama_bank?.message}
                              onChangeText={(text) => {onChange(text)}}
                              value={value}
                              placeholder="NAMA BANK"
                          /> 
                      )}
                  />
                <View style={{marginTop: 15}} />  
                <Text title="Nominal Payment" />
                  <Controller
                      defaultValue={listar?.amount_payment}
                      name="nominal_payment"
                      control={control}
                      rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                      render={({field: { onChange, value }}) => ( 
                        <Input
                            error={errors?.nominal_payment}
                            errorText={errors?.nominal_payment?.message}
                            onChangeText={(text) => {onChange(text)}}
                            value={value}
                            placeholder="NOMINAL PEMBAYARAN"
                        />
                      )}
                  />
            </>
            }
            { jenisPayment == 'tunai' &&
            <>
              <View style={{marginTop: 15}} />  
              <Text title="Nominal Payment" />
                <Controller
                    defaultValue={listar?.amount_payment}
                    name="nominal_payment"
                    control={control}
                    rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                    render={({field: { onChange, value }}) => ( 
                      <Input
                          error={errors?.nominal_payment}
                          errorText={errors?.nominal_payment?.message}
                          onChangeText={(text) => {onChange(text)}}
                          value={value}
                          placeholder="NOMINAL PEMBAYARAN"
                      />
                    )}
                />
            </>
            }
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
                defaultValue={total_tagihan}
                name="total_pembayaran"
                control={control}
                rules={{ required: { value: true, message: 'Total pembayaran harus diisi' } }}
                render={({field: {onChange, value}}) => (
                  <Input
                      error={errors?.total_pembayaran}
                      errorText={errors?.total_pembayaran?.message}
                      onChangeText={(text) => {onChange(text)}}
                      value={value}
                      placeholder="TOTAL PEMBAYARAN"
                  />
                )}
            />
          </View>
          </Card.Content>
        </Card>
      </View>
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
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
      </View>
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