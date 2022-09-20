import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react'
import { useForm, Controller } from 'react-hook-form';
import { View, InteractionManager, TouchableHighlight, StyleSheet, Dimensions, Image, Alert } from 'react-native'
import { Appbar, Button, IconButton, TouchableRipple } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Toast from 'react-native-simple-toast';
import _ from 'lodash';

import Input from '../../components/Input';
import SelectPicker from './../../components/SelectPicker';
import Text from '../../components/Text'
import Loading from '../../components/Loading';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from '../../components/DatePicker';
import moment from 'moment';

const SCREEN_WIDTH = Dimensions.get('window').width;

// const checkSelfie = () => {
//     Alert.alert(
//         "PRINGATAN",
//         "FOTO ATAU OUTLET TIDAK BOLEH KOSONG",
//         [{
//             text: "OK",
//             onPress: () => console.log("Ya"),
//             style: "yes"
//         }],
//     );
//     return true;
// }
const OthersAbsenCar = (props) => {
    const dataItem = [];
    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState(null);
    const [imageActivity, setImageActivity] = useState(null);

    const { handleSubmit, control, errors, setValue, reset } = useForm(); // initialize the hook
    // const onSubmit = async (data) => {
    //     setLoading(true)
    //     try {
    //         if(imageActivity == null || outlet == null){
    //             checkSelfie();
    //             setLoading(false)
    //             return true;
    //         }
    //         data['image_activity'] = imageActivity;
    //         data['outlet_id'] = outlet.outlet_id;
    //         const postvisit = await props.actions.storeItem(Common.CREATE_MANUAL_VISIT, data);
    //         if(postvisit.success) {
    //             Toast.show('Visit manual berhasil disubmit.')
    //             props.navigation.goBack();
    //         }
    //     } catch (error) {
    //         alert(error);
    //     } finally {
    //         setLoading(false)
    //     }
    // }
    
    // const loadData = async() => {
    //     try {
    //         await props.actions.fetchAll(Common.FORM_MANUAL_VISIT);
    //     } catch (error) {
    //         alert(error);
    //     } finally {
    //         setLoading(false)
    //     }
    // }
    // useEffect(() => {
    //     const interactionPromise = InteractionManager.runAfterInteractions(() => { 
    //         loadData();
    //     });
    //     return () => interactionPromise.cancel();
    // }, [])

     // ref
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['25%']);
    const handlePresentModalPress = useCallback((item) => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index) => {
        console.log(index);
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
    const chooseCamera = async () => {
        try {
            const imageSet = await ImagePicker.openCamera({
                compressImageQuality: 0.3,
                cropping: false,
                includeBase64: true,
                writeTempFile: false,
                useFrontCamera: true,
                mediaType: 'photo'
            })
            const source = 'data:image/jpeg;base64,' + imageSet.data;
            setImageActivity(source);
        } catch (error) {
            alert(error)
        } finally {
            bottomSheetModalRef.current?.close();
        }
    }
    const chooseImage = async () => {
        try {
            const imageSet = await ImagePicker.openPicker({
                mediaType: 'photo',
                compressImageQuality: 0.3,
                cropping: false,
                writeTempFile: false,
                includeBase64: true,
            })
            const source = 'data:image/jpeg;base64,' + imageSet.data;
            setImageActivity(source);
        } catch (error) {
           alert(error);
        } finally {
            bottomSheetModalRef.current?.close();
        }
    }

    const cleanupImages = async() => {
        try {
            ImagePicker.clean().then(() => {
                setImageActivity(null)
            })
        } catch (error) {
            alert(error);
        } finally {

        }
    }

    const onSubmit = () => {
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
                    // onSubmitHeader()
                },
                style: "cancel"
            }],
        );
    }

    return (
        <View style={{flex: 1, backgroundColor: '#ffff', paddingLeft: 15, paddingRight: 15}}>
          <ScrollView
            style={{flex:1}}
            showsVerticalScrollIndicator={false}
            horizontal={false}
          >
            <View style={{marginTop: 25}} flexDirection="row">
                <Text title="KILOMETER BERANGKAT" h6 bold />
            </View>
            <View style={{marginTop: 15}} flexDirection="row">
                { imageActivity == null ?
                    <TouchableHighlight
                        onPress={() => handlePresentModalPress()}
                        style={{ backgroundColor: 'white', width: '100%', borderRadius: 10}} 
                        activeOpacity={0.8} 
                        underlayColor="#bbbcbd"  
                    >
                        <View style={{minHeight: 180, backgroundColor: 'grey', borderRadius: 10, width: '100%'}} alignItems="center" justifyContent="center">
                            <Text title="UPLOAD FOTO" style={{color: '#FFFF'}} bold h2 />
                            <Text title="KM BERANGKAT" style={{color: '#FFFF'}} bold h2 />
                        </View>
                    </TouchableHighlight>
                    :
                    <View style={{minHeight: 180, borderRadius: 10, width: '100%'}}>
                        <Image source={{uri: imageActivity}} style={{height: 180}} />
                        <View style={{backgroundColor: '#FFFF', position: 'absolute', borderRadius: 20, top: 10, right: 10}}>
                            <IconButton 
                                icon="close"
                                color={'red'}
                                size={20}
                                onPress={() => cleanupImages()}
                            />
                        </View>
                    </View>
                }
            </View>
            <View style={{marginTop: 15, marginBottom: 15}}>
                <View style={{flexDirection: 'row'}}>
                    <Text title="CATATAN KM BERANGKAT" h6 bold />
                    <Text title=" *" h6 bold style={{ color: 'red' }} />
                </View>
                <Controller
                    defaultValue=""
                    name="catatan_kilometer_go"
                    control={control}
                    rules={{ required: { value: true, message: 'Catatan kilometer harus diisi' } }}
                    render={({ onChange, value }) => (
                        <Input
                            error={errors?.catatan_kilometer_go}
                            errorText={errors?.catatan_kilometer_go?.message}
                            value={value}
                            onChangeText={(text) => onChange(text)}
                            multiline={true}
                            placeholder="CATATAN KILOMETER - CTH : 289019KM"
                        />
                    )}
                />
            </View>
            <View style={{marginTop: 25}} flexDirection="row">
                <Text title="KILOMETER PULANG" h6 bold />
            </View>
            <View style={{marginTop: 15}} flexDirection="row">
                { imageActivity == null ?
                    <TouchableHighlight
                        onPress={() => handlePresentModalPress()}
                        style={{ backgroundColor: 'white', width: '100%', borderRadius: 10}} 
                        activeOpacity={0.8} 
                        underlayColor="#bbbcbd"  
                    >
                        <View style={{minHeight: 180, backgroundColor: 'grey', borderRadius: 10, width: '100%'}} alignItems="center" justifyContent="center">
                            <Text title="UPLOAD FOTO" style={{color: '#FFFF'}} bold h2 />
                            <Text title="KM PULANG" style={{color: '#FFFF'}} bold h2 />
                        </View>
                    </TouchableHighlight>
                    :
                    <View style={{minHeight: 180, borderRadius: 10, width: '100%'}}>
                        <Image source={{uri: imageActivity}} style={{height: 180}} />
                        <View style={{backgroundColor: '#FFFF', position: 'absolute', borderRadius: 20, top: 10, right: 10}}>
                            <IconButton 
                                icon="close"
                                color={'red'}
                                size={20}
                                onPress={() => cleanupImages()}
                            />
                        </View>
                    </View>
                }
            </View>
            <View style={{marginTop: 15, marginBottom: 15}}>
                <View style={{flexDirection: 'row'}}>
                    <Text title="CATATAN KM PULANG" h6 bold />
                    <Text title=" *" h6 bold style={{ color: 'red' }} />
                </View>
                <Controller
                    defaultValue=""
                    name="catatan_kilometer_back"
                    control={control}
                    rules={{ required: { value: true, message: 'Catatan kilometer harus diisi' } }}
                    render={({ onChange, value }) => (
                        <Input
                            error={errors?.catatan_kilometer_back}
                            errorText={errors?.catatan_kilometer_back?.message}
                            value={value}
                            onChangeText={(text) => onChange(text)}
                            multiline={true}
                            placeholder="CATATAN KILOMETER - CTH : 289019KM"
                        />
                    )}
                />
            </View>
            <Button contentStyle={{height: 50}} mode="contained" onPress={() => { onSubmit() }}>
                SUBMIT
            </Button>
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

export default OthersAbsenCar;
