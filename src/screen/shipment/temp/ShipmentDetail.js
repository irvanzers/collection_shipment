import React, { useState, useEffect }  from 'react'
import { Button, View, StyleSheet, ScrollView, TouchableHighlight } from 'react-native'
import { useForm, Controller } from 'react-hook-form';

import Text from './../../components/Text';
import Input from '../../components/Input';
import { List, Card, Title, Paragraph, TextInput, IconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../constants/theme';


const ShipmentDetail = ( {navigation} ) => {
  const [text, setText] = React.useState("");
  const { handleSubmit, control, errors, setValue } = useForm(); // initialize the hook
  const [error, setError] = useState('');

  return (
    <View style={{flex:1}}>
    <ScrollView
        style={{flex:1}}
        showsVerticalScrollIndicator={false}
        horizontal={false}
    >
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <View style={{marginTop: 10, paddingBottom: 10}} flexDirection="row">
            <TouchableHighlight
                // onPress={() => handlePresentModalPress()}
                style={{ backgroundColor: 'white', width: '100%', borderRadius: 10}} 
                activeOpacity={0.8} 
                underlayColor="#bbbcbd"  
            >
                <View style={{minHeight: 180, backgroundColor: 'grey', borderRadius: 10, width: '100%'}} alignItems="center" justifyContent="center">
                    <Text title="UPLOAD FOTO" style={{color: '#FFFF'}} bold h2 />
                    <Text title="SELFIE" style={{color: '#FFFF'}} bold h2 />
                </View>
            </TouchableHighlight>
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
              PT. Sangkuriang
            </Title>
            <Paragraph>Jl. Kembang Kenangan No. 124, Malang, Kab. Malang</Paragraph>
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
              title="Catatan" 
              h5 bold style={{color: '#000000'}} 
            />           
            <Controller
                defaultValue=""
                name="visit_catatan"
                control={control}
                rules={{ required: { value: true, message: 'Catatan kunjungan harus diisi' } }}
                render={({ onChange, value }) => (
                    <Input
                        // error={errors.visit_catatan}
                        // errorText={errors?.visit_catatan?.message}
                        onChangeText={(text) => {onChange(text)}}
                        value={value}
                        multiline={true}
                        placeholder="CATATAN PENGIRIMAN"
                    />
                )}
            /> 
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
        {/* <Card>
          <Card.Content>            
            <Text
              title="Surat Jalan" 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{ paddingTop: 5 }} />
            <View style={{paddingTop: '2%', paddingBottom: '5%', flexDirection: 'row' }}>          
              <TextInput
                label="Kode Surat Jalan"
                value={text}
                onChangeText={text => setText(text)}
                style={{width: '75%'}}
              />
              <TouchableOpacity style={{ paddingLeft: 10 }}>
                <IconButton
                  icon="barcode-scan"
                  color={'#ffffff'}
                  size={40}
                  onPress={() => navigation.navigate('ScannerScreen')}
                  style={{ 
                    // paddingLeft: 10,
                    backgroundColor: '#4077c4',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#619AEA'
                  }}
                />
              </TouchableOpacity>      
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
        </Card> */}
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

export default ShipmentDetail;