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
import Clipboard from '@react-native-clipboard/clipboard';

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

let total_pembayaran = 0;

const CollectionPayment = ( props ) => {
  const detailar = props.route.params.data;
  const {collectionproduct} = props;
  const navigation = useNavigation();
  const [text, setText] = React.useState("");
  const { handleSubmit, control, formState: {errors}, setValue } = useForm(); // initialize the hook
  const [isLoading, setIsLoading] = useState(true);
  const [jenisPayment, setJenisPayment] = useState('');
  const [expanded, setExpanded] = useState(1);
  const [mountTransfer, setMountTransfer] = useState(0);
  const [mountTunai, setMountTunai] = useState(0);
  const [mountGiro, setMountGiro] = useState(0);

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
      data['total_payment'] = total_pembayaran;
      data['job_status'] = '2';
      data['sisa_payment'] = detailar.amount_due_remaining - total_pembayaran;
      const updatePay = await props.actions.storeItem(Common.UPDATE_COLLECTION_PAYMENT, data);
      // console.log(updatePay.success);
      if(updatePay.success){
          // await props.actions.fetchAll(Common.USER_PROFILE);
          props.route.params.onBack();
          Toast.show('Pembayaran berhasil disimpan');
          props.navigation.goBack();
          // console.log(props.route.params.onBack())
      }
    } catch (error) {
      alert(error)
    }
  }

  const onSaveDraft = async(data) => {
    try {
      data['payment_ar'] = true;
      data['trx_number'] = detailar.trx_number;
      data['total_payment'] = total_pembayaran;
      data['job_status'] = '1';
      data['sisa_payment'] = detailar.amount_due_remaining - total_pembayaran;
      const updatePay = await props.actions.storeItem(Common.UPDATE_COLLECTION_PAYMENT, data);
      // console.log(updatePay.success);
      if(updatePay.success){
      //     // await props.actions.fetchAll(Common.USER_PROFILE);
          props.route.params.onBack();
          Toast.show('Pembayaran berhasil disimpan');
          props.navigation.goBack();
      }
      console.log(data)
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
  // console.log(detailar);
  const trans = mountTunai+mountTransfer+mountGiro;
  total_pembayaran =  detailar?.total_payment == '0' ? trans : detailar?.total_payment;
  console.log(detailar.job_status)
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
            <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10, marginBottom: 15}}>
                <Text title={`No. Tagihan ${detailar.trx_number}`} bold />
                <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                  {detailar.job_status == 1 ?
                    <Text 
                      title={'DRAFT'} bold style={{ color: 'grey' }}
                    />
                    :
                    (
                      <>
                      {detailar.job_status >= 2 &&
                        <Text 
                          title={'TAGIHAN TERSUBMIT'} bold style={{ color: 'green' }}
                        />
                      }
                      {/* {detailar.collection_status == 'tertagih' &&
                        <Text 
                          title={'TERTAGIH'} bold style={{ color: 'green' }}
                        />
                      }
                      {detailar.collection_status == 'tidak_tertagih' &&
                        <Text 
                          title={'TIDAK TERTAGIH'} bold style={{ color: 'grey' }}
                        />
                      }
                      {detailar.collection_status == 'toko_tutup' &&
                        <Text 
                          title={'TOKO TUTUP'} bold style={{ color: 'red' }}
                        />
                      }
                      {detailar.collection_status == 'tidak_ada_dana' &&
                        <Text 
                          title={'TIDAK ADA DANA'} bold style={{ color: 'red' }}
                        />
                      }
                      {detailar.collection_status == null &&
                        <Text 
                          title={'BELUM DI KUNJUNGI'} bold style={{ color: 'grey' }}
                        />
                      } */}
                      </>
                    )
                  }
                </View>
            </View>
            <Title 
              style={{color: '#000000', fontWeight: 'bold'}}
            >
              {detailar.cust_name}
            </Title>
          <View style={{ marginTop:10 }} />
          <Paragraph>{detailar.bill_to_address}</Paragraph>
          <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 20, paddingBottom: 5}}>
            <Text title={'Total Tagihan'} h5 bold style={{paddingTop:8}} />
            <NumberFormat 
                value={detailar.amount_due_remaining} 
                displayType={'text'} 
                prefix={`Rp. `} 
                thousandSeparator={true}
                renderText={(value) =>  {
                    return (
                        <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                          <TouchableOpacity onPress={() => {
                            Clipboard.setString(`${detailar.amount_due_remaining}`)
                            Toast.show('Sudah di salin.');
                            }} >
                            <Text title={value} h5 bold />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                            Clipboard.setString(`${detailar.amount_due_remaining}`)
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
          {detailar.amount_payment_tunai != 0 &&
          <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 20}}>
            <Text title={'Jumlah Tunai'} h6 bold style={{paddingTop:8}} />
            <NumberFormat 
                value={detailar.amount_payment_tunai} 
                displayType={'text'} 
                prefix={`Rp. `} 
                thousandSeparator={true}
                renderText={(value) =>  {
                    return (
                        <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                            <Text title={value} h6 bold style={{paddingTop:8}} />
                        </View>
                    )
                }}
            />
          </View>
          }
          {detailar.amount_payment_transfer != 0 &&
          <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10}}>
            <Text title={'Jumlah Transfer'} h6 bold style={{paddingTop:8}} />
            <NumberFormat 
                value={detailar.amount_payment_transfer} 
                displayType={'text'} 
                prefix={`Rp. `} 
                thousandSeparator={true}
                renderText={(value) =>  {
                    return (
                        <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                            <Text title={value} h6 bold style={{paddingTop:8}} />
                        </View>
                    )
                }}
            />
          </View>
          }
          {detailar.amount_payment_giro != 0 &&
          <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 10, paddingBottom: 5}}>
            <Text title={'Jumlah Giro'} h6 bold style={{paddingTop:8}} />
            <NumberFormat 
                value={detailar.amount_payment_giro} 
                displayType={'text'} 
                prefix={`Rp. `} 
                thousandSeparator={true}
                renderText={(value) =>  {
                    return (
                        <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                            <Text title={value} h6 bold style={{paddingTop:8}} />
                        </View>
                    )
                }}
            />
          </View>
          }
          <View style={{borderColor: 'grey', borderWidth: .5}} />
          <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 0}}>
            <Text title={'Jumlah Bayar'} h6 bold style={{paddingTop:8}} />
            <NumberFormat 
                value={detailar.total_payment} 
                displayType={'text'} 
                prefix={`Rp. `} 
                thousandSeparator={true}
                renderText={(value) =>  {
                    return (
                        <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                            <Text title={value} h6 bold style={{paddingTop:8}} />
                        </View>
                    )
                }}
            />
          </View>
          <View flexDirection="row" justifyContent="space-between" style={{paddingTop: 0}}>
            <Text title={'Sisa Bayar'} h6 bold style={{paddingTop:8}} />
            <NumberFormat 
                value={detailar.sisa_payment} 
                displayType={'text'} 
                prefix={`Rp. `} 
                thousandSeparator={true}
                renderText={(value) =>  {
                    return (
                        <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                            <Text title={value} h6 bold style={{paddingTop:8}} />
                        </View>
                    )
                }}
            />
          </View>
          { detailar.job_status == 3 &&
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
      { detailar.job_status <= 1 &&
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
                        defaultValue={moment(new Date()).format('YYYY-MM-DD')}
                        name="transfer_date"
                        control={control}
                        // rules={{ required: { value: true, message: 'Tanggal kunjungan harus diisi' } }}
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
                <Text title={"Nominal Pembayaran Transfer" }/>
                  <Controller
                      defaultValue={detailar?.amount_payment_transfer}
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
                    defaultValue={detailar?.amount_payment_tunai}
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
                      defaultValue={detailar?.giro_number}
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
                        // rules={{ required: { value: true, message: 'Tanggal kunjungan harus diisi' } }}
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
                        defaultValue={detailar?.amount_payment_giro}
                        name="nominal_payment_giro"
                        control={control}
                        // rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                        render={({field: { onChange, value }}) => (
                          <Input
                              onChangeText={(text) => {
                                setMountGiro(parseInt(text));
                                onChange(text)
                              }}
                              value={value}
                              placeholder="NOMINAL PEMBAYARAN"
                              error={errors?.nominal_payment_giro}
                              errorText={errors?.nominal_payment_giro?.message}
                          />
                        )}
                    />
                <View style={{marginTop: 25}} />
                <View style={{borderColor: 'grey', borderWidth: .5}} /> 
                <View style={{marginTop: 5}} /> 
                
                <Text title={'TOTAL PEMBAYARAN'} bold />
                  <Controller
                      defaultValue={detailar?.total_payment}
                      name="total_payment"
                      control={control}
                      // rules={{ required: { value: true, message: 'Nominal Pembayaran Harus Di isi' } }}
                      render={({field: { onChange, value }}) => ( 
                        <Input
                            error={errors?.total_payment}
                            errorText={errors?.total_payment?.message}
                            onChangeText={(text) => {onChange(text)}}
                            disabled
                            value={`${~~total_pembayaran}`}
                            placeholder="TOTAL PEMBAYARAN"
                        />
                      )}
                  />
            </View>
            </Card.Content>
          </Card>
        </View>  
      <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20, width: '100%',  paddingTop: '2%'}}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSaveDraft)}  
        >
          SAVE DRAFT
        </Button>
        <View style={{paddingTop: 10}} />
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}  
        >
          SUBMIT
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