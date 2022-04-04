import React, { useState, useEffect }  from 'react'
import { Button, View, StyleSheet, ScrollView, TouchableHighlight } from 'react-native'
import { useForm, Controller } from 'react-hook-form';

import Text from './../../components/Text';
import Input from '../../components/Input';
import SelectPicker from './../../components/SelectPicker';
import { List, Card, Title, Paragraph, TextInput, IconButton } from 'react-native-paper';


const CollectionDetail = ( {navigation} ) => {
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
              title="List Tagihan" 
              h5 bold style={{color: '#000000'}} 
            />    
            <List.Item
              title="AR - 2213000036"
              description="Nominal Rp. 179.811,-"
              left={props => <List.Icon {...props} icon="chevron-double-right" />}
            />    
            <List.Item
              title="AR - 2213000031"
              description="Nominal Rp. 57.750,-"
              left={props => <List.Icon {...props} icon="chevron-double-right" />}
            />    
            <List.Item
              title="AR - 2213000033"
              description="Nominal Rp. 156.658,-"
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
              title="Status Tagihan" 
              h5 bold style={{color: '#000000'}} 
            />            
            <View style={{marginTop: 15}}>
            <SelectPicker
                items = {[
                            { label: 'Toko Tutup', value: 'toko_tutup' },
                            { label: 'Tidak Terkunjungi', value: 'tidak_terkunjungi' },
                            { label: 'Tuker Faktur', value: 'tuker_faktur' },
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

export default CollectionDetail;