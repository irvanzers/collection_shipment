import React, { useState, useEffect, useCallback }  from 'react'
import { View, StyleSheet, ScrollView, InteractionManager } from 'react-native'
import { useForm, Controller } from 'react-hook-form';

import Text from '../../components/Text';
import Input from '../../components/Input';
import { List, Card, Title, Paragraph, TextInput, IconButton, Button } from 'react-native-paper';
import SelectPicker from './../../components/SelectPicker';
import moment from 'moment';
import DatePicker from '../../components/DatePicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../constants/theme';
import Toast from 'react-native-simple-toast';
import Loading from './../../components/Loading';
import NumberFormat from 'react-number-format';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _, { reduce } from 'lodash';
import * as apiAction from './../../redux/actions/apiAction';
import * as crudAction from '../../redux/actions/crudAction';
import * as flashMessage from '../../redux/actions/flashMessage';
import * as authService from './../../redux/services/authService';
import Common from './../../redux/constants/common';
import {getUuid, setUuid} from './../../redux/utils/actionUtil';
import { useNavigation } from '@react-navigation/core';

const CollectionPayment = ( props ) => {
  const detailar = props.route.params.data;
  const {collectionproduct} = props;
  const navigation = useNavigation();
  const [text, setText] = React.useState("");
  const { handleSubmit, control, formState: {errors}, setValue } = useForm(); // initialize the hook
  const [isLoading, setIsLoading] = useState(true);
  const [jenisPayment, setJenisPayment] = useState('');
  const [expanded, setExpanded] = useState(1);

  const loadData = async () => {
      try {
          const datasubmit = {
              trx_number: props.route.params.data.trx_number
          }
          await props.actions.fetchAll(Common.COLLECTION_DETAIL_PRODUCT, datasubmit); 
          setIsLoading(false);     
      } catch (error) {
          alert(error)
      } finally {
        setIsLoading(false);  
      }
  }

  const onSubmit = async(data) => {
    try {
      data['payment_ar'] = true;
      data['trx_number'] = detailar.trx_number;
      data['job_status'] = '2';
      const updatePay = await props.actions.storeItem(Common.UPDATE_COLLECTION_PAYMENT, data);
      // console.log(updatePay.success);
      if(updatePay.success){
          // await props.actions.fetchAll(Common.USER_PROFILE);
          props.route.params.onBack();
          Toast.show('Pembayaran berhasil disimpan');
          props.navigation.goBack();
      }
    } catch (error) {
      alert(error)
    }
  }

  const onSaveDraft = async(data) => {
    try {
      data['payment_ar'] = true;
      data['trx_number'] = detailar.trx_number;
      data['job_status'] = '1';
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
  
  useEffect(() => {
      const interactionPromise = InteractionManager.runAfterInteractions(() => {
          loadData()
      });
      return () => interactionPromise.cancel();
  },[])

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const detailproduct = collectionproduct ? collectionproduct : [];
  console.log(detailar);

  return (
    <View style={{flex:1}}>
    <ScrollView
        style={{flex:1}}
        showsVerticalScrollIndicator={false}
        horizontal={false}
    >
    <Loading loading={isLoading} /> 
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
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
            {detailar.cust_name}
          </Title>
          <View style={{ marginTop:10 }} />
          <Paragraph>{detailar.bill_to_address}</Paragraph>
          <View style={{ marginTop:20 }}>       
              <Text title= {`No. Tagihan : ${detailar.trx_number}`} />
              <NumberFormat 
                  value={detailar.amount_due_remaining} 
                  displayType={'text'} 
                  prefix={`Nominal Tagihan : Rp. `} 
                  thousandSeparator={true}
                  renderText={(value) =>  {
                      return (
                          <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                              <Text title={value} />
                          </View>
                      )
                  }}
              />              
          </View>
          { detailar.job_status == 2 &&
            <React.Fragment>
            <View style={{ marginTop:20 }}>
              { detailar.payment_type == 'giro_bank' && 
                <> 
                <Text title= {`Tipe Pembayaran : ${detailar.payment_type == 'giro_bank' && 'Giro Bank'}`} />
                <Text title= {`No. Giro : ${detailar.giro_number}`} />
                <Text title= {`Nama Bank : ${detailar.bank_account}`} />
                <Text title= {`Tgl. Pencairan Giro : ${detailar.tgl_pencairan_giro}`} />
                <NumberFormat 
                    value={detailar.amount_payment} 
                    displayType={'text'} 
                    prefix={`Nominal Pembayaran : Rp. `} 
                    thousandSeparator={true}
                    renderText={(value) =>  {
                        return (
                            <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                                <Text title={value} />
                            </View>
                        )
                    }}
                />      
                </>
              } 
              { detailar.payment_type == 'transfer' && 
                <> 
                <Text title= {`Tipe Pembayaran : ${detailar.payment_type == transfer && 'Transfer'}`} />
                <Text title= {`Nama Bank : ${detailar.bank_account}`} />
                <NumberFormat 
                    value={detailar.amount_payment} 
                    displayType={'text'} 
                    prefix={`Nominal Transfer : Rp. `} 
                    thousandSeparator={true}
                    renderText={(value) =>  {
                        return (
                            <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                                <Text title={value} />
                            </View>
                        )
                    }}
                />      
                </>
              } 
              { detailar.payment_type == 'tunai' && 
                <> 
                <Text title= {`Tipe Pembayaran : ${detailar.payment_type == 'tunai' && 'Tunai'}`} />
                <NumberFormat 
                    value={detailar.amount_payment} 
                    displayType={'text'} 
                    prefix={`Nominal Pembayaran : Rp. `} 
                    thousandSeparator={true}
                    renderText={(value) =>  {
                        return (
                            <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                                <Text title={value} />
                            </View>
                        )
                    }}
                />      
                </>
              }        
            </View>
            </React.Fragment>
          }
          <View style={{marginTop: 20}}>
            <Button icon={expanded != 0 ? 'arrow-down-thick' : 'arrow-up-thick'} mode='text' onPress={ () => setExpanded(!expanded) }>
              { expanded != 0 ? 'More Detail' : 'Less More'}
            </Button> 
          </View>
          </Card.Content>
        </Card>
      </View>
      { expanded == 0 &&
        <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>     
          <Card>
            <Card.Content>
              <Text
                title="Rincian Produk" 
                h5 bold style={{color: '#000000'}} 
              />         
              { detailproduct != undefined && detailproduct?.map((item, index) => {
                return (
                  <React.Fragment>
                    <List.Item
                      title={item.description}
                      description={`Qty: ${item.quantity}`}
                      left={props => <List.Icon {...props} icon="chevron-double-right" />}
                    />  
                  </React.Fragment>
                )
              })}  
            </Card.Content>
          </Card>         
        </View>
      }      
      { detailar.job_status != 2 &&
      <React.Fragment>
        <View style={{ paddingTop: 10 }} />
        <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
          <Card>
            <Card.Content>             
              <Text
                title="Metode Pembayaran" 
                h5 bold style={{color: '#000000'}} 
              />            
              <View style={{marginTop: 15}}>
                <Controller
                    defaultValue={detailar?.payment_type}
                    name="payment_type"
                    control={control}
                    rules={{ required: { value: true, message: 'Payment type harus di pilih' } }}
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
              </View>
            </Card.Content>
          </Card>
        </View>        
        <View style={{ paddingTop: 10 }} />      
        {
          jenisPayment == 'giro_bank' &&
        <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 }}>
          <Card>
            <Card.Content>             
              <Text
                title="No. Giro" 
                h5 bold style={{color: '#000000'}} 
              />            
              <View style={{marginTop: 15}}>  
                <Controller
                    defaultValue={detailar?.giro_number}
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
              </View>     
              <View style={{marginTop: 15}}></View>
              <View style={{marginTop: 10, marginBottom: 0}}>
                  <View style={{flexDirection: 'row'}}>
                      <Text title="TANGGAL JATUH TEMPO" h6 bold/>
                      <Text title=" *" h6 bold style={{color: 'red'}}/>
                  </View>
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
              </View>
              <View style={{marginTop: 15}}></View>
              <Text
                title="Nama Bank" 
                h5 bold style={{color: '#000000'}} 
              />            
              <View style={{marginTop: 15}}>    
                <Controller
                    defaultValue={detailar?.bank_account}
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
              </View>
              <View style={{marginTop: 15}}></View>
              <Text
                title="Nominal Pembayaran" 
                h5 bold style={{color: '#000000'}} 
              />            
              <View style={{marginTop: 15}}>  
                <Controller
                    defaultValue={detailar?.amount_payment}
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
              </View>
            </Card.Content>
          </Card>
        </View>  
      }
      {
        jenisPayment == 'transfer' &&
        <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 }}>
          <Card>
            <Card.Content>             
              <Text
                title="No. Rekening" 
                h5 bold style={{color: '#000000'}} 
              />            
              <View style={{marginTop: 15}}> 
                <Controller
                    defaultValue={detailar?.nomor_rekening}
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
              </View>
              <View style={{marginTop: 15}}></View>
              <View style={{marginTop: 10, marginBottom: 0}}>
                  <View style={{flexDirection: 'row'}}>
                      <Text title="Tanggal Transfer" 
                      h5 bold style={{color: '#000000'}} />
                      {/* <Text title=" *" h6 bold style={{color: 'red'}}/> */}
                  </View>
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
              </View>
              <View style={{marginTop: 15}}></View>
              <Text
                title="Nominal Pembayaran" 
                h5 bold style={{color: '#000000'}} 
              />            
              <View style={{marginTop: 15}}>  
                <Controller
                    defaultValue={detailar?.amount_payment}
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
              </View>
            </Card.Content>
          </Card>
        </View>  
      }
      {
        (jenisPayment == 'tunai' || detailar.payment_type== 'tunai') &&
        <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 }}>
          <Card>
            <Card.Content>     
              <Text
                title="Nominal Pembayaran" 
                h5 bold style={{color: '#000000'}} 
              />            
              <View style={{marginTop: 15}}>  
                <Controller
                    defaultValue={detailar?.amount_payment}
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
              </View>
            </Card.Content>
          </Card>
        </View>  
      }
      <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20, width: '100%',  paddingTop: '2%'}}>
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
    collectionproduct: state.crud.collectionproducts,
  }
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(_.assign({}, crudAction, apiAction, flashMessage, authService), dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CollectionPayment);