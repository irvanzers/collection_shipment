import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { Button, View, ImageBackground, ScrollView, StyleSheet, InteractionManager } from 'react-native'

import { useForm, Controller } from 'react-hook-form';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { RadioButton } from "react-native-paper";
import MenuHome from './../../components/Menu/MenuHome';
import Text from './../../components/Text';
import Input from './../../components/Input';
import { theme } from '../../constants/theme';
import Loading from './../../components/Loading';
import NumberFormat from 'react-number-format';
import Toast from 'react-native-simple-toast';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _, { reduce, update } from 'lodash';
import * as apiAction from './../../redux/actions/apiAction';
import * as crudAction from '../../redux/actions/crudAction';
import * as flashMessage from '../../redux/actions/flashMessage';
import * as authService from './../../redux/services/authService';
import Common from './../../redux/constants/common';
import { TouchableHighlight } from 'react-native-gesture-handler';

const HomeScreen = (props) => {
  const { usercollector } = props;
  const { handleSubmit, control, formState: {errors}, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [jenisSetor, setJenisSetor] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  

  const loadData = async() => {  
    try { 
        await props.actions.fetchAll(Common.USER_COLLECTOR_PROFILE);
        setIsLoading(true);  
    } catch (error) {
        alert(error)
    } finally {
        setIsLoading(false);        
    }
  }

  const mustLogin = () => {
    if(props.isAuthenticated){
        props.navigation.navigate('LoginScreen')
    } else {
        props.navigation.navigate('ScannerScreen')
    }
  }
  
  const onSubmit = async (data) => {
      try {
            setIsLoading(true)
            if (data.setor_saldo > user?.wallet){
                alert('Saldo anda tidak mencukupi');
                return true;
            }
            data['jenis_setor'] = jenisSetor;
            
            const updateSetor = await props.actions.storeItem(Common.POST_SETOR_KEKASIR, data);
            if(updateSetor.success){
                // await props.actions.fetchAll(Common.USER_PROFILE);
                Toast.show('Setor saldo berhasil disubmit');
                //   props.navigation.goBack();
                loadData();
                bottomSheetModalRef.current?.close();
            }
      } catch (error) {
          alert(error)
      } finally {
        bottomSheetModalRef.current?.close();
        setIsLoading(false)
      }
  }

  const Logout = () => {
    // if(props.isAuthenticated){
    //     props.navigation.navigate('ScannerScreen')
    // } else {
        props.navigation.navigate('LoginScreen')
    // }
  }

  const toggleBottomNavigationView = () => {
      setVisible(!visible);
  };
  
//   const snapPoints = useMemo(() => ['42']);
//   Layout Xiaomi Redmi a7
  const snapPoints = useMemo(() => ['52']);
  
  const bottomSheetModalRef = useRef(null);
  const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
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
  
  
    useEffect(() => {
        const interactionPromise = InteractionManager.runAfterInteractions(() => {
            loadData()
        });
        return () => interactionPromise.cancel();
    },[])

    const onGoBack = () => {
        loadData()
    }
  
    const user = usercollector ? usercollector : [];
    // console.log(user)
  return (
    <BottomSheetModalProvider style={styles.container}>
        <View style={{flex:1}}>      
        <Loading loading={isLoading} /> 
        <ScrollView
            style={{flex:1}}
            showsVerticalScrollIndicator={false}
            horizontal={false}
        >
        <TouchableHighlight  onPress={handlePresentModalPress}  style={{padding: 10}}>
            <ImageBackground 
                source={require('./../../assets/bgcard.jpg')} 
                resizeMode="cover" 
                imageStyle={{ borderRadius: 10}}
                style={{width: '100%', height: 180, borderRadius: 10}}
            >
                <View style={{ paddingLeft: 10, marginTop: 10 }}>
                    <Text title={`Selamat Datang, ${user.name}`} h6 style={{color: '#FFFF'}} />
                </View>
                { user.app_name == 'COLLECTION' &&
                <View style={{marginTop: 80, paddingLeft: 10}}>
                    <Text title=" " h6 style={{color: '#0000'}} />
                    <NumberFormat 
                        value={user.wallet} 
                        displayType={'text'} 
                        prefix={`Total Saldo Rp. `} 
                        thousandSeparator={true}
                        renderText={(value) =>  {
                            return (
                                <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end'}}>
                                    <Text title={value} h6 style={{color: '#ffff'}} />
                                </View>
                            )
                        }}
                    />
                </View>
                }
            </ImageBackground>
        </TouchableHighlight>
        
        <View flexDirection="row" style={{justifyContent: 'space-around', marginTop: 10, marginBottom: 10}}>
            { user.app_name != 'SHIPMENT' &&
            <MenuHome item={{
                text: 'Shipment',
                image: require(`./../../assets/icon-shipment.png`),
                onNavigation: () => props.navigation.navigate('ShipmentHeaderList')
            }} />
            }
            { user.app_name == 'COLLECTION' &&
            <MenuHome item={{
                text: 'Collections',
                image: require(`./../../assets/icon-collection.png`),
                onNavigation: () => props.navigation.navigate('CollectionHeaderList', {onBackPage: () => onGoBack()})
            }} />
            }
            <MenuHome item={{
                text: 'Lainnya',
                image: require(`./../../assets/icon-others.png`),
                onNavigation: () => props.navigation.navigate('OthersIndex', {onBackPage: () => onGoBack()})
            }} />
        </View>

        <View flexDirection="row" style={{justifyContent: 'space-around', marginTop: 10, marginBottom: 10}}>
            {/* <MenuHome item={{
                text: 'Lainnya',
                image: require(`./../../assets/icon-others.png`),
                onNavigation: () => props.navigation.navigate('OthersIndex', {onBackPage: () => onGoBack()})
            }} /> */}
            <MenuHome item={{
                text: 'Logout',
                image: require(`./../../assets/icon-logout.png`),
                onNavigation: () => Logout()
            }} />
        </View>
        </ScrollView>
        </View>
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
                <Text title="SETOR SALDO" h6 bold />
                <View style={{ marginTop: 10 }}>
                    <Controller
                        defaultValue={`${user?.wallet}`}
                        name="setor_saldo"
                        control={control}
                        rules={{ required: { value: true, message: 'Nilai saldo harus diisi' } }}
                        render={({ field: { onChange, value, onBlur} }) => (
                            <>
                            <Input
                                error={errors.setor_saldo}
                                errorText={errors?.setor_saldo?.message}
                                onChangeText={(text) => {
                                    onChange(text)
                                }}
                                style={{ fontSize: 24 }}
                                value={value.toLocaleString("id-ID")}
                                keyboardType={'numeric'}
                                placeholder=""
                            />
                          </>
                        )}
                    />
                </View>
                <View style={{marginTop: 15}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text title="PILIHAN SETOR" h6 bold/>
                        <Text title=" *" h6 bold style={{color: 'red'}}/>
                    </View>
                    <Controller
                        defaultValue={0}
                        name="jenis_setor"
                        control={control}
                        rules={{ required: { value: true, message: 'Harus pilih jenis setoran' } }}
                        render={({ onChange, value }) => (
                            <View style = {styles.view}>
                                <View style={{alignItems: 'center'}}>
                                    <Text onPress={() => setJenisSetor(0)} title="Setor Transfer" p />
                                    <RadioButton
                                        value={0}
                                        status={ jenisSetor == 0 ? 'checked' : 'unchecked' }
                                        color = {theme.colors.primary}
                                        onPress={() => setJenisSetor(0)}
                                        disabled
                                    />
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    <Text onPress={() => setJenisSetor(1)} title="Setor Ke Kasir" p/>
                                    <RadioButton
                                        value={1}
                                        color = {theme.colors.primary}
                                        status={ jenisSetor == 1 ? 'checked' : 'unchecked' }
                                        onPress={() => setJenisSetor(1)}
                                    />
                                </View>
                            </View>
                        )}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 }}>
                    
                </View>
                <Button 
                    title="Konfirmasi" 
                    mode="contained" 
                    disabled={loading} 
                    contentStyle={{ height: 50 }} 
                    style={{ width: '100%' }} 
                    onPress={handleSubmit(onSubmit)} 
                />
            </View>
        </BottomSheetModal>
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
    view: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
    },
});

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        apiState: state.api,
        message: state.flash.message,
        usercollector: state.crud.usercollectors,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(_.assign({}, authService, crudAction, apiAction, flashMessage), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);