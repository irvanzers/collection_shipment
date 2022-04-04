import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react'
import { useForm, Controller } from 'react-hook-form';
import { View, InteractionManager, TouchableHighlight, StyleSheet, Dimensions, Image, Alert } from 'react-native'
import { Appbar, Button, IconButton, TouchableRipple } from 'react-native-paper';
import { connect, useSelector } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Toast from 'react-native-simple-toast';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as apiAction from './../../redux/actions/apiAction';
import * as crudAction from '../../redux/actions/crudAction';
import * as flashMessage from '../../redux/actions/flashMessage';
import Common from './../../redux/constants/common';

import Input from '../../components/Input';
import SelectPicker from '../../components/SelectPicker';
import Text from '../../components/Text'
import Loading from '../../components/Loading';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from '../../components/DatePicker';
import moment from 'moment';

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
const VisitManual = (props) => {
    const dataItem = [];
    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState(null);
    const [imageActivity, setImageActivity] = useState(null);
    const [outlet, setOutlet] = useState(null)

    const { handleSubmit, control, errors, setValue, reset } = useForm(); // initialize the hook
    const onSubmit = async (data) => {
        setLoading(true)
        try {
            if(imageActivity == null || outlet == null){
                checkSelfie();
                setLoading(false)
                return true;
            }
            data['image_activity'] = imageActivity;
            data['outlet_id'] = outlet.outlet_id;
            const postvisit = await props.actions.storeItem(Common.CREATE_MANUAL_VISIT, data);
            if(postvisit.success) {
                Toast.show('Visit manual berhasil disubmit.')
                props.navigation.goBack();
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false)
        }
    }

    const form_manual = useSelector((state) => {
        return state.crud.formmanualvisits;
    })
    
    const loadData = async() => {
        try {
            await props.actions.fetchAll(Common.FORM_MANUAL_VISIT);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        const interactionPromise = InteractionManager.runAfterInteractions(() => { 
            loadData();
        });
        return () => interactionPromise.cancel();
    }, [])

     // ref
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['25%']);
    const handlePresentModalPress = useCallback((item) => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
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
    if(loading){
        return <Loading loading={loading} />
    }
    if(form_manual == null){
        return (
            <View style={{flex: 1}}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                    <Appbar.Content style={{paddingLeft: 0}} title={`TAMBAH KUNJUNGAN`} />
                </Appbar.Header>
                <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
                    <Text title={'Belum ada kunjungan yang harus di submit, nih'} bold p />
                    <Text title={'Tetap semangat, rejeki nggak akan pergi'} p style={{color: 'grey'}} />
                    <Text title={'asal kamu pantang menyerah.'} p style={{color: 'grey'}} />
                </View>
            </View>
        )
    }
    const chooseOutlet = (item) => {
        setOutlet(item);
    }
    return (
        <BottomSheetModalProvider>
            <View style={{flex: 1, backgroundColor: '#ffff'}}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                    <Appbar.Content style={{paddingLeft: 0}} title={`TAMBAH KUNJUNGAN`} />
                </Appbar.Header>
                <ScrollView
                    style={{flex:1}}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                >
                    <View style={{padding: 10, flex: 1}}>
                        <BottomSheetModal
                            ref={bottomSheetModalRef}
                            initialSnapIndex={1}
                            snapPoints={snapPoints}
                            onChange={handleSheetChanges}
                            backdropComponent={renderBackdrop}
                            keyboardBehavior="interactive"
                            keyboardBlurBehavior="restore"
                        >
                            <View flexDirection="row" justifyContent="space-between" style={styles.contentContainer}>
                                <TouchableHighlight
                                    onPress={() => chooseCamera()}
                                    activeOpacity={0.8} 
                                    underlayColor="#bbbcbd" 
                                    style={styles.viewBox}
                                >
                                    <Text style={{color: '#FFFF'}}  title="DARI KAMERA" bold h5 />
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => chooseImage()}
                                    activeOpacity={0.8} 
                                    underlayColor="#bbbcbd" 
                                    style={styles.viewBox}
                                >
                                    <Text style={{color: '#FFFF'}}  title="DARI GALERI" bold h5 />
                                </TouchableHighlight>
                            </View>
                        </BottomSheetModal>
                        <View style={{marginTop: 10, marginBottom: 10}}>
                            <Button icon="store" mode="contained" 
                                onPress={() => props.navigation.navigate('ManualOutlet', {
                                    onGoBack: (item) => chooseOutlet(item)
                                })}
                            >
                                {outlet == null ? 'Pilih Outlet' : outlet.outlet_name+', '+outlet.merchant_title}
                            </Button>
                        </View>
                        <View style={{marginTop: 10, marginBottom: 0}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text title="TANGGAL KUNJUNGAN" h6 bold/>
                                <Text title=" *" h6 bold style={{color: 'red'}}/>
                            </View>
                            <Controller
                                defaultValue={form_manual.lov_visit != null ? moment(form_manual.lov_visit).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')}
                                name="visit_date"
                                control={control}
                                rules={{ required: { value: true, message: 'Tanggal kunjungan harus diisi' } }}
                                render={({ onChange, value }) => {
                                    if(form_manual.lov_visit != null){
                                        return (
                                            <DatePicker
                                                style={styles.datePickerStyle}
                                                date={value} // Initial date from state
                                                mode="date" // The enum of date, datetime and time
                                                format="YYYY-MM-DD"
                                                value={value}
                                                minDate={form_manual.lov_visit != null ? moment(form_manual.lov_visit).format('YYYY-MM-DD') : false}
                                                defaultDate={form_manual.lov_visit != null ? moment(form_manual.lov_visit).format('YYYY-MM-DD') : false}
                                                error={errors.visit_date}
                                                errorText={errors?.visit_date?.message}
                                                onDateChange={(data) => { onChange(data) }}
                                            />
                                        )
                                    } else {
                                        return (
                                            <DatePicker
                                                style={styles.datePickerStyle}
                                                date={value} // Initial date from state
                                                mode="date" // The enum of date, datetime and time
                                                format="YYYY-MM-DD"
                                                value={value}
                                                error={errors.visit_date}
                                                errorText={errors?.visit_date?.message}
                                                onDateChange={(data) => { onChange(data) }}
                                            />
                                        )
                                    }
                                }}
                            />
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
                                        <Text title="SELFIE" style={{color: '#FFFF'}} bold h2 />
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
                                <Text title="CATATAN VISIT" h6 bold />
                                <Text title=" *" h6 bold style={{ color: 'red' }} />
                            </View>
                            <Controller
                                defaultValue=""
                                name="visit_catatan"
                                control={control}
                                rules={{ required: { value: true, message: 'Catatan visit harus diisi' } }}
                                render={({ onChange, value }) => (
                                    <Input
                                        error={errors?.visit_catatan}
                                        errorText={errors?.visit_catatan?.message}
                                        value={value}
                                        onChangeText={(text) => onChange(text)}
                                        multiline={true}
                                        placeholder="CATATAN VISIT"
                                    />
                                )}
                            />
                        </View>
                        <Button contentStyle={{height: 50}} mode="contained" onPress={handleSubmit(onSubmit)}>
                            SUBMIT
                        </Button>
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
        apiState: state.api,
        message: state.flash.message,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(_.assign({}, crudAction, apiAction, flashMessage), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisitManual)
