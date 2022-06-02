import React, { useState, useCallback, useRef, useMemo } from 'react'
import { Button, View, ImageBackground, ScrollView, StyleSheet } from 'react-native'

import { useForm, Controller } from 'react-hook-form';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import MenuHome from './../../components/Menu/MenuHome';
import Text from './../../components/Text';
import Input from './../../components/Input';

const HomeScreen = (props) => {
  const { handleSubmit, control, errors, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  
  const mustLogin = () => {
    if(props.isAuthenticated){
        props.navigation.navigate('LoginScreen')
    } else {
        props.navigation.navigate('ScannerScreen')
    }
  }
  
  const onSubmit = async (data) => {
        // if (data.saldo > profile.user.user_saldo){
        //     alert('Saldo anda tidak mencukupi');
        //     return true;
        // }
        // postTransfer(data)
        // bottomSheetModalRef.current?.close();
  }

  const Logout = () => {
    if(props.isAuthenticated){
        props.navigation.navigate('ScannerScreen')
    } else {
        props.navigation.navigate('LoginScreen')
    }
  }

  const toggleBottomNavigationView = () => {
      setVisible(!visible);
  };
  
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['35%']);
  const handlePresentModalPress = useCallback((item) => {
      bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
      console.log(index)
  }, []);

  
  const renderBackdrop = useCallback(
    props => (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
        />
    ),
    []
  );
  // const { navigate } = this.props.navigation;
  return (
    <BottomSheetModalProvider style={styles.container}>
    <View style={{flex:1}}>      
    <BottomSheetModal
          ref={bottomSheetModalRef}
          initialSnapIndex={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
      >
          <View style={styles.bottomNavigationView}>
              <Text title="TRANSFER SALDO KE YASA" h6 bold />
              {/* <View style={{ marginTop: 10 }}>
                  <Controller
                      defaultValue={`0`}
                      name="saldo"
                      control={control}
                      rules={{ required: { value: true, message: 'Nilai uang tunai harus diisi' } }}
                      render={({ onChange, value }) => (
                          <Input
                              error={errors.saldo}
                              errorText={errors?.saldo?.message}
                              onChangeText={(text) => {
                                  onChange(text)
                              }}
                              style={{ fontSize: 24 }}
                              value={value}
                              keyboardType={'numeric'}
                              placeholder=""
                          />
                      )}
                  />
              </View> */}
              {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 }}>
                  
              </View>
              <Button mode="contained" disabled={loading} contentStyle={{ height: 50 }} style={{ width: '100%' }} onPress={handleSubmit(onSubmit)}>
                  Konfirmasi
              </Button> */}
          </View>
    </BottomSheetModal>
    <ScrollView
        style={{flex:1}}
        showsVerticalScrollIndicator={false}
        horizontal={false}
    >
    
      <View style={{padding: 10}}>
          <ImageBackground 
              source={require('./../../assets/bgcard.jpg')} 
              resizeMode="cover" 
              imageStyle={{ borderRadius: 10}}
              style={{width: '100%', height: 180, borderRadius: 10}}
          >
              <View style={{ padding: 10 }}>
                  <Text title="Selamat Datang, Irvan" h6 style={{color: '#FFFF'}} />
              </View>
              <View style={{marginTop: 60, paddingLeft: 10}}>
                  <Text title=" " h6 style={{color: '#0000'}} />
                  <Text title="Collection & Shipment" h6 style={{color: '#ffff'}} />
                  <Text onPress={handlePresentModalPress} title="Total Saldo" h6 style={{color: '#ffff'}} />
              </View>
          </ImageBackground>
      </View>
      
      <View flexDirection="row" style={{justifyContent: 'space-around', marginTop: 10, marginBottom: 10}}>
          <MenuHome item={{
              text: 'Shipment',
              image: require(`./../../assets/icon-shipment.png`),
              onNavigation: () => props.navigation.navigate('ShipmentHeaderList')
          }} />
          <MenuHome item={{
              text: 'Collections',
              image: require(`./../../assets/icon-collection.png`),
              onNavigation: () => props.navigation.navigate('CollectionHeaderList')
          }} />
      </View>

      <View flexDirection="row" style={{justifyContent: 'space-around', marginTop: 10, marginBottom: 10}}>
          <MenuHome item={{
              text: 'Lainnya',
              image: require(`./../../assets/icon-others.png`),
              onNavigation: () => props.navigation.navigate('OthersIndex')
          }} />
          <MenuHome item={{
              text: 'Logout',
              image: require(`./../../assets/icon-logout.png`),
              onNavigation: () => Logout()
          }} />
      </View>
      </ScrollView>
    </View>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    divider: {
        backgroundColor: '#aeaea1',
        padding: 1,
        marginTop: 10
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: 250,
        padding: 10
    },
});

export default HomeScreen;