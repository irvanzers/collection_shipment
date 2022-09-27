import React, {useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { View, InteractionManager, TouchableHighlight, StyleSheet, Dimensions, Image, Alert } from 'react-native'
import { Appbar, Card, Button, IconButton } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';

import Input from '../../components/Input';
import Text from '../../components/Text'
import Loading from '../../components/Loading';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
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

const SCREEN_WIDTH = Dimensions.get('window').width;

const checkSelfie = () => {
    Alert.alert(
        "PRINGATAN",
        "FOTO ATAU OUTLET TIDAK BOLEH KOSONG",
        [{
            text: "OK",
            onPress: () => console.log("Ya"),
            style: "yes"
        }],
    );
    return true;
}
const ShipmentAbsenCar = (props) => {
    const dataItem = props.route.params.data;
    const {shipmentabsencar} = props;
    const navigation = useNavigation();
    const { handleSubmit, control, formState: {errors}, setValue, getValues } = useForm(); // initialize the hook
    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState(null);
    const [ImageGo, setImageGo] = useState(null);
    const [ImageBack, setImageBack] = useState(null);
    const [ImageSJ, setImageSJ] = useState(null);
    const [disButton, setDisButton] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const ROOT_URL = 'https://egis.galenium.com/v1/';
    
    const loadData = async () => {
    setIsLoading(false);  
    setDisButton(false);
        try {
            const datasubmit = {
                header_id: dataItem?.header_id,
                user_id: dataItem?.user_id,
            }
            await props.actions.fetchAll(Common.SHIPMENT_ABSEN_CAR, datasubmit); 
        } catch (error) {
            alert(error)
        } finally {
        setIsLoading(false);  
        setDisButton(false);
        }
    }

    const cleanupImages = async() => {
        try {
            ImagePicker.clean().then(() => {
                setImageGo(null)
            })
        } catch (error) {
            alert(error);
        } finally {

        }
    }

    const onSavePhotoSJ = async(source) => {
        try {
        let datasubmit = {};
        if(source == null){
            checkSelfie()
            return true;
        }
        // setIsLoading(true)
        datasubmit['absen_sj'] = true;
        datasubmit['headers_id'] = dataabsen.headers_id;
        datasubmit['users_id'] = dataabsen.users_id;
        datasubmit['visit_selfie'] = source;
        const updatePay = await props.actions.storeItem(Common.SUBMIT_ABSEN_CAR, datasubmit);
        if(updatePay.success){
            // await props.actions.fetchAll(Common.USER_PROFILE);
            Toast.show('Foto berhasil disimpan');
            loadData();
        }
        } catch (error) {
        alert(error)
        }
    }

    // const onSavePhotoGo = async(source) => {
    //     try {
    //     let datasubmit = {};
    //     if(source == null){
    //         checkSelfie()
    //         return true;
    //     }
    //     // setIsLoading(true)
    //     datasubmit['absen_go'] = true;
    //     datasubmit['headers_id'] = dataabsen.headers_id;
    //     datasubmit['users_id'] = dataabsen.users_id;
    //     datasubmit['visit_selfie'] = source;
    //     const updatePay = await props.actions.storeItem(Common.SUBMIT_ABSEN_CAR, datasubmit);
    //     if(updatePay.success){
    //         // await props.actions.fetchAll(Common.USER_PROFILE);
    //         Toast.show('Foto berhasil disimpan');
    //         loadData();
    //     }
    //     } catch (error) {
    //     alert(error)
    //     }
    // }

    // const onSavePhotoBack = async(source) => {
    //     try {
    //     let datasubmit = {};
    //     if(source == null){
    //         checkSelfie()
    //         return true;
    //     }
    //     // setIsLoading(true)
    //     datasubmit['absen_back'] = true;
    //     datasubmit['headers_id'] = dataabsen.headers_id;
    //     datasubmit['users_id'] = dataabsen.users_id;
    //     datasubmit['visit_selfie'] = source;
    //     const updatePay = await props.actions.storeItem(Common.SUBMIT_ABSEN_CAR, datasubmit);
    //     if(updatePay.success){
    //         // await props.actions.fetchAll(Common.USER_PROFILE);
    //         Toast.show('Foto berhasil disimpan');
    //         loadData();
    //     }
    //     // console.log(datasubmit);
    //     } catch (error) {
    //     alert(error)
    //     }
    // }

    const launchCameraSJ = () => {
        ImagePicker.openCamera({
            compressImageQuality: 0.1,
            cropping: false,
            includeBase64: true
        }).then(response => {
            if (!response.didCancel && !response.error) {
                const source = 'data:image/jpeg;base64,' + response.data;
                setImageSJ(source)
                onSavePhotoSJ(source);
            }
        }).catch(e => alert('ANDA BELUM MENGAMBIL GAMBAR'));
    }

    // const launchCameraGo = () => {
    //     ImagePicker.openCamera({
    //         compressImageQuality: 0.1,
    //         cropping: false,
    //         includeBase64: true
    //     }).then(response => {
    //         if (!response.didCancel && !response.error) {
    //             const source = 'data:image/jpeg;base64,' + response.data;
    //             setImageGo(source)
    //             onSavePhotoGo(source);
    //         }
    //     }).catch(e => alert('ANDA BELUM MENGAMBIL GAMBAR'));
    // }
  
    // const launchCameraBack = () => {
    //     ImagePicker.openCamera({
    //         compressImageQuality: 0.1,
    //         cropping: false,
    //         includeBase64: true
    //     }).then(response => {
    //         if (!response.didCancel && !response.error) {
    //             const source = 'data:image/jpeg;base64,' + response.data;
    //             setImageBack(source)
    //             onSavePhotoBack(source);
    //         }
    //     }).catch(e => alert('ANDA BELUM MENGAMBIL GAMBAR'));
    // }

    const onGoBack = () => {
      loadData();
    }
  
    //GETTING PHOTO
    const renderAssetSJ = (fotoSelfieSj) => {
        return (
            <Card style={{ width: '100%' }}>
                <Card.Cover source={{uri: `${ROOT_URL}${fotoSelfieSj}`}} style={{ height: 300 }} />
                <Card.Actions style={{justifyContent: 'center'}}>
                </Card.Actions>
            </Card>
        );
    }

    // const renderAssetGo = (fotoSelfieGo) => {
    //     return (
    //         <Card style={{ width: '100%' }}>
    //             <Card.Cover source={{uri: `${ROOT_URL}${fotoSelfieGo}`}} style={{ height: 300 }} />
    //             <Card.Actions style={{justifyContent: 'center'}}>
    //             </Card.Actions>
    //         </Card>
    //     );
    // }
    
    // const renderAssetBack = (fotoSelfieBack) => {
    //     return (
    //         <Card style={{ width: '100%' }}>
    //             <Card.Cover source={{uri: `${ROOT_URL}${fotoSelfieBack}`}} style={{ height: 300 }} />
    //             <Card.Actions style={{justifyContent: 'center'}}>
    //                 {/* <Button mode="contained" onPress={()=> cleanupImages()}>REMOVE</Button> */}
    //             </Card.Actions>
    //         </Card>
    //     );
    // }

    const onSubmit = async (data) => {
        // try {
        //     console.log(data)
        // } catch (error) {
        //     alert(error)
        // }
        if(dataabsen.absen_go == null){
            handleSubmit(onSubmitAbsen(data));
        } else {
            Alert.alert(
                "PERHATIAN",
                "JIKA ADA JOB YANG BELUM DI VISIT/SUBMIT, MAKA STATUSNYA TIDAK TERKUNJUNGI!",
                [{
                    text: "BATAL",
                    onPress: () => console.log("No, continue editing")
                }, {
                    text: "YA",
                    onPress: () => {
                        console.log('Yes')
                        handleSubmit(onSubmitAbsen(data));
                    },
                    style: "cancel"
                }],
            );
        }
    }

    const onSubmitAbsen = async(data) => {
        try {
            // if(dataabsen.absen_go == null || dataabsen.absen_back == null){
            //     checkSelfie()
            //     return true;
            // } 
            data['submit_absen_km'] = true;
            data['headers_id'] = dataabsen.headers_id;
            data['users_id'] = dataabsen.users_id;
            if(ImageGo == null || dataabsen.absen_go == null) {
                data['status_absen'] = '1';
            } else {
                data['status_absen'] = '2';
            }
            const updatePay = await props.actions.storeItem(Common.SUBMIT_ABSEN_CAR, data);
            if(updatePay.success){
                // await props.actions.fetchAll(Common.USER_PROFILE);
                Toast.show('Data berhasil disimpan');
                loadData();
            }
        // console.log(data);
        } catch (error) {
        alert(error)
        }
    }

    useEffect(() => {
        const interactionPromise = InteractionManager.runAfterInteractions(() => { 
            loadData();
        });
        setIsLoading(false)
        return () => interactionPromise.cancel();
    }, [])

    const dataabsen = shipmentabsencar ? shipmentabsencar[0] : [];
    // console.log(dataabsen)

    return (
        <View style={{flex: 1}}>
          <ScrollView
            style={{flex:1}}
            showsVerticalScrollIndicator={false}
            horizontal={false}
          >
          <Appbar.Header>
              <Appbar.BackAction onPress={() => props.navigation.goBack()} />
              <Appbar.Content title={'ABSEN KILOMETER'} />
              {/* <Appbar.Action icon={'calendar'} onPress={showDatepicker} /> */}
          </Appbar.Header>
          <View style={{backgroundColor: '#ffff', paddingLeft: 15, paddingRight: 15}}>
            <View style={{marginTop: 25}} flexDirection="row">
                <Text title="CHECK TANDA TERIMA SURAT JALAN" h6 bold />
            </View>
            <View style={{marginTop: 15}} flexDirection="row">
              { ImageSJ != null || dataabsen.absen_sj != null ?
                   renderAssetSJ(dataabsen.absen_sj)
                   :
                  (
                    <TouchableHighlight
                        onPress={() => launchCameraSJ()}
                        style={{ backgroundColor: 'white', width: '100%', borderRadius: 10}} 
                        activeOpacity={0.8} 
                        underlayColor="#bbbcbd"  
                    >
                        <View style={{minHeight: 180, backgroundColor: 'grey', borderRadius: 10, width: '100%'}} alignItems="center" justifyContent="center">
                            <Text title="UPLOAD FOTO" style={{color: '#FFFF'}} bold h2 />
                            <Text title="TANDA TERIMA SJ" style={{color: '#FFFF'}} bold h2 />
                        </View>
                    </TouchableHighlight>
                   )
                }
            </View>
          </View>
          <View style={{backgroundColor: '#ffff', paddingLeft: 15, paddingRight: 15}}>
            <View style={{marginTop: 25}} flexDirection="row">
                <Text title="KILOMETER BERANGKAT" h6 bold />
            </View>
            <View style={{marginTop: 15}} flexDirection="row">
              { ImageGo != null || dataabsen.absen_go != null ?
                   renderAssetGo(dataabsen.absen_go)
                   :
                  (
                    <TouchableHighlight
                        onPress={() => launchCameraGo()}
                        style={{ backgroundColor: 'white', width: '100%', borderRadius: 10}} 
                        activeOpacity={0.8} 
                        underlayColor="#bbbcbd"  
                    >
                        <View style={{minHeight: 180, backgroundColor: 'grey', borderRadius: 10, width: '100%'}} alignItems="center" justifyContent="center">
                            <Text title="UPLOAD FOTO" style={{color: '#FFFF'}} bold h2 />
                            <Text title="KM BERANGKAT" style={{color: '#FFFF'}} bold h2 />
                        </View>
                    </TouchableHighlight>
                   )
                }
            </View>
            <View style={{marginTop: 15, marginBottom: 15}}>
                <View style={{flexDirection: 'row', paddingBottom: 10}}>
                    <Text title="CATATAN KM BERANGKAT" h6 bold />
                    {dataabsen.catatan_absen_go == null &&
                        <Text title=" *" h6 bold style={{ color: 'red' }} />
                    }
                </View>
                {dataabsen.catatan_absen_go == null ?
                <Controller
                    defaultValue={dataabsen.catatan_absen_go}
                    name="catatan_absen_go"
                    control={control}
                    // rules={{ required: { value: true, message: 'Catatan kilometer harus diisi' } }}
                    render={({field: { onChange, value, onBlur }}) => (
                        <Input
                            error={errors?.catatan_absen_go}
                            errorText={errors?.catatan_absen_go?.message}
                            value={value}
                            onChangeText={(text) => onChange(text)}
                            multiline={true}
                            placeholder="CATATAN KILOMETER - CTH : 289019KM"
                        />
                    )}
                />    
                :
                (
                    <Text title={`Catatan Saat Berangkat ${dataabsen.catatan_absen_go}`} bold h7 />
                )
                }      
            </View>     
            <View style={{marginTop: 25}} flexDirection="row">
                <Text title="KILOMETER PULANG" h6 bold />
            </View>
            <View style={{marginTop: 15}} flexDirection="row">
              { ImageBack != null || dataabsen.absen_back != null ?
                   renderAssetBack(dataabsen.absen_back)
                   :
                  (
                    <TouchableHighlight
                        onPress={() => launchCameraBack()}
                        style={{ backgroundColor: 'white', width: '100%', borderRadius: 10}} 
                        activeOpacity={0.8} 
                        underlayColor="#bbbcbd"  
                    >
                        <View style={{minHeight: 180, backgroundColor: 'grey', borderRadius: 10, width: '100%'}} alignItems="center" justifyContent="center">
                            <Text title="UPLOAD FOTO" style={{color: '#FFFF'}} bold h2 />
                            <Text title="KM PULANG" style={{color: '#FFFF'}} bold h2 />
                        </View>
                    </TouchableHighlight>
                   )
                }
            </View>
            <View style={{marginTop: 15, marginBottom: 15}}>
                <View style={{flexDirection: 'row'}}>
                    <Text title="CATATAN KM PULANG" h6 bold />
                    {dataabsen.catatan_absen_back == null &&
                        <Text title=" *" h6 bold style={{ color: 'red' }} />
                    }
                </View>
                {dataabsen.catatan_absen_back == null ?
                <Controller
                    defaultValue={dataabsen.catatan_absen_back}
                    name="catatan_absen_back"
                    control={control}
                    // rules={{ required: { value: true, message: 'Catatan kilometer harus diisi' } }}
                    render={({field: { onChange, value, onBlur }}) => (
                        <Input
                            error={errors?.catatan_absen_back}
                            errorText={errors?.catatan_absen_back?.message}
                            value={value}
                            onChangeText={(text) => onChange(text)}
                            multiline={true}
                            placeholder="CATATAN KILOMETER - CTH : 289019KM"
                        />
                    )}
                />
                :
                (
                    <Text title={`Catatan Saat Berangkat ${dataabsen.catatan_absen_back}`} bold h7 />
                )
                }  
            </View>
            <Button contentStyle={{height: 50}} mode="contained" onPress={handleSubmit(onSubmit)}>
                SUBMIT
            </Button>
            <View style={{ paddingBottom: 30 }} />
          </View>
          </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewLine: {
        backgroundColor: '#a3a3a3ea',
        padding: 4,
        marginTop: 5
    },
    contentContainer: {
        flex: 1,
        padding: 10
    },
    viewBox: {
        width: SCREEN_WIDTH/2 - 20, 
        backgroundColor: '#adadad', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});

function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated,
      apiState: state.api,
      message: state.flash.message,
      shipmentabsencar: state.crud.shipmentabsencars,
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(_.assign({}, crudAction, apiAction, flashMessage, authService), dispatch)
    }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(ShipmentAbsenCar);
