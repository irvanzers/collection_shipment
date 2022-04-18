import React, { useState, useEffect, useCallback }  from 'react'
import { View, StyleSheet, ScrollView, TouchableHighlight, InteractionManager, Button } from 'react-native'
import { useForm, Controller } from 'react-hook-form';

import Text from './../../components/Text';
import Input from '../../components/Input';
import SelectPicker from './../../components/SelectPicker';
import { List, Card, Title, Paragraph, TextInput, IconButton } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

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

const CollectionDetail = ( props ) => {
  const {collectiondetail} = props;
  const navigation = useNavigation();
  const [text, setText] = React.useState("");
  const { handleSubmit, control, errors, setValue } = useForm(); // initialize the hook
  const [error, setError] = useState('');
  const [visitSelfie, setVisitSelfie] = useState(null);

  const loadData = async () => {
      try {
          const datasubmit = {
              cust_id: props.route.params.cust_id
          }
          // const uuId = await getUuid();
          // if(!props.isAuthenticated){
              // await props.actions.fetchAll(Common.COLLECTION_DATA);   
              // await props.actions.fetchAll(Common.COLLECTION_DRAFT);    
          // } else {
          // await props.actions.fetchAll(Common.COLLECTION_DATA);   
          await props.actions.fetchAll(Common.COLLECTION_DETAIL, datasubmit);    
          // }
      } catch (error) {
          alert(error)
      } finally {

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
          }
      }).catch(e => alert('ANDA BELUM MENGAMBIL GAMBAR'));
  }

  useEffect(() => {
      const interactionPromise = InteractionManager.runAfterInteractions(() => {
          loadData()
      });
      return () => interactionPromise.cancel();
  },[])
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const detaildata = collectiondetail ? collectiondetail.cust_detail : [];
  const listar = collectiondetail ? collectiondetail.list_ar : [];
  // console.log(detaildata);

  return (
    <View style={{flex:1}}>
    <ScrollView
        style={{flex:1}}
        showsVerticalScrollIndicator={false}
        horizontal={false}
    >
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
              return (
                <List.Item
                  title={`No. AR ${item.trx_number}`}
                  key={index}
                  description={`Nominal Rp. ${item.amount_due_remaining}`}
                  left={props => <List.Icon {...props} icon="chevron-double-right" />}
                  onPress={() => navigation.push('CollectionPayment', {data: item})}
                />    
              )
            })}
          </Card.Content>
        </Card>         
      </View>
      <View style={{ paddingTop: 10 }} />
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Card>
          <Card.Content>             
            <Text
              title="Status Tagihan" 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>
            <SelectPicker
                items = {[
                            { label: 'Toko Tutup', value: 'toko_tutup' },
                            { label: 'Tidak Ada Faktur', value: 'tidak_ada_faktur' },
                            { label: 'Tidak Tertagih', value: 'tidak_tertagih' },
                            { label: 'Tertagih', value: 'tertagih' },
                        ]}
                onDataChange={(value) => console.log(value)}
                placeholder="STATUS TAGIHAN"
            />            
            <Input
                // error={errors.visit_catatan}
                // errorText={errors?.visit_catatan?.message}
                onChangeText={(text) => {onChange(text)}}
                // value={value}
                placeholder="CATATAN"
            />
          </View>
          </Card.Content>
        </Card>
      </View>
      <View style={{ paddingTop: 10 }} />
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Card>
          <Card.Content>             
            <Text
              title="Metode Pembayaran" 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>
            <SelectPicker
                items = {[
                            { label: 'Giro Bank', value: 'giro_bank' },
                            { label: 'Transfer', value: 'transfer' },
                            { label: 'Tunai', value: 'tunai' },
                        ]}
                onDataChange={(value) => console.log(value)}
                placeholder="METODE PEMBAYARAN"
            />            
            <Input
                // error={errors.visit_catatan}
                // errorText={errors?.visit_catatan?.message}
                onChangeText={(text) => {onChange(text)}}
                // value={value}
                placeholder="NO GIRO/NOMINAL"
            />
          </View>
          </Card.Content>
        </Card>
      </View>
      <View style={{ paddingTop: 10 }} />
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Card>
          <Card.Content>             
            <Text
              title="Total Pembayaran" 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>
            <Input
                // error={errors.visit_catatan}
                // errorText={errors?.visit_catatan?.message}
                onChangeText={(text) => {onChange(text)}}
                // value={value}
                placeholder="TOTAL PEMBAYARAN"
            />
          </View>
          </Card.Content>
        </Card>
      </View>
      <View style={{ paddingTop: 10 }} />
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Card>
          <Card.Content>             
            <Text
              title="Sisa Pembayaran" 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>
            <Input
                // error={errors.visit_catatan}
                // errorText={errors?.visit_catatan?.message}
                onChangeText={(text) => {onChange(text)}}
                // value={value}
                placeholder="SISA PEMBAYARAN"
            />
          </View>
          </Card.Content>
        </Card>
      </View>
      <View style={{ paddingTop: 10 }} />
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <Card>
          <Card.Content>             
            <Text
              title="Catatan" 
              h5 bold style={{color: '#000000'}} 
            />        
            {/* <Controller
                defaultValue=""
                name="visit_catatan"
                control={control}
                rules={{ required: { value: true, message: 'Catatan kunjungan harus diisi' } }}
                render={({ onChange, value }) => ( */}
                    <Input
                        // error={errors.visit_catatan}
                        // errorText={errors?.visit_catatan?.message}
                        onChangeText={(text) => {onChange(text)}}
                        // value={value}
                        multiline={true}
                        placeholder="CATATAN PENGIRIMAN"
                    />
                {/* )}
            /> */}    
          <View style={{width: '100%', paddingTop: '2%'}}>
            <Button
              title = "Submit"
              contentStyle={{height: 500}}
              onPress={() =>
                navigation.navigate('Beranda')
              }
            />
          </View>  
          </Card.Content>  
        </Card>        
        <View style={{width: '100%', paddingBottom: '10%'}} />
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
    collectiondetail: state.crud.collectiondetails,
  }
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(_.assign({}, crudAction, apiAction, flashMessage, authService), dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CollectionDetail);