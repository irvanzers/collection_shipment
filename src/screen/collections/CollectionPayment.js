import React, { useState, useEffect, useCallback }  from 'react'
import { Button, View, StyleSheet, ScrollView, InteractionManager } from 'react-native'
import { useForm, Controller } from 'react-hook-form';

import Text from '../../components/Text';
import Input from '../../components/Input';
import { List, Card, Title, Paragraph, TextInput, IconButton } from 'react-native-paper';
import SelectPicker from './../../components/SelectPicker';
import moment from 'moment';
import DatePicker from '../../components/DatePicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../constants/theme';

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
  const navigation = useNavigation();
  const [text, setText] = React.useState("");
  const { handleSubmit, control, errors, setValue } = useForm(); // initialize the hook
  const [error, setError] = useState('');

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  // console.log(detailar);

  return (
    <View style={{flex:1}}>
    <ScrollView
        style={{flex:1}}
        showsVerticalScrollIndicator={false}
        horizontal={false}
    >
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
          <Paragraph>{`Nominal Tagihan : Rp ${detailar.amount_due_remaining}`}</Paragraph>
          <Paragraph>{`No. Tagihan : ${detailar.trx_number}`}</Paragraph>
          </Card.Content>
        </Card>
      </View>
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>     
        <Card>
          <Card.Content>
            <Text
              title="Rincian Produk" 
              h5 bold style={{color: '#000000'}} 
            />    
            <List.Item
              title="Skintex"
              description="Qty: 2"
              left={props => <List.Icon {...props} icon="chevron-double-right" />}
            />    
            <List.Item
              title="Oilum Brightening Bottle Refill 210ml"
              description="Qty: 5"
              left={props => <List.Icon {...props} icon="chevron-double-right" />}
            />    
            <List.Item
              title="JF Handsanitizer Spray 100ml"
              description="Qty: 4"
              left={props => <List.Icon {...props} icon="chevron-double-right" />}
            />
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
            </View>
          </Card.Content>
        </Card>
      </View>      
      
      <View style={{ paddingTop: 10 }} />
      <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 }}>
        <Card>
          <Card.Content>             
            <Text
              title="No. Giro" 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>  
            <Input
                // error={errors.visit_catatan}
                // errorText={errors?.visit_catatan?.message}
                onChangeText={(text) => {onChange(text)}}
                // value={value}
                placeholder="NO. GIRO"
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
                    name="visit_date"
                    control={control}
                    rules={{ required: { value: true, message: 'Tanggal kunjungan harus diisi' } }}
                    render={({ onChange, value }) => (
                        <DatePicker
                            style={styles.datePickerStyle}
                            date={value} // Initial date from state
                            mode="date" // The enum of date, datetime and time
                            format="YYYY-MM-DD"
                            // value={value}
                            // error={errors.visit_date}
                            // errorText={errors?.visit_date?.message}
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
            <Input
                // error={errors.visit_catatan}
                // errorText={errors?.visit_catatan?.message}
                onChangeText={(text) => {onChange(text)}}
                // value={value}
                placeholder="NAMA BANK"
            />
            </View>
            <View style={{marginTop: 15}}></View>
            <Text
              title="Nominal Pembayaran" 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>  
            <Input
                // error={errors.visit_catatan}
                // errorText={errors?.visit_catatan?.message}
                onChangeText={(text) => {onChange(text)}}
                // value={value}
                placeholder="NOMINAL PEMBAYARAN"
            />
            </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(CollectionPayment);