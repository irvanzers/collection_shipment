import React, { useState, useEffect }  from 'react'
import { 
  Button, 
  View, 
  StyleSheet,
  Text,
  Modal,
  Pressable,
  Dimensions
} from 'react-native'

import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
// import { useNavigation } from '@react-navigation/native';


const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

console.disableYellowBox = true;

const ScannerScreen = ( { navigation } ) => {
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect (() => {
    setResult(null);
  }, [])

  const makeSlideOutTranslation = (translationType, fromValue) =>
  {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.15
      },
      to: {
        [translationType]: fromValue
      }
    };
  };
  
  const onSuccess = e => {
    setResult(e);
    alert(e.data)
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err)
    // );
  };

  return (
    <QRCodeScanner
    onRead={onSuccess}
    showMarker={true}
    // cameraProps={{ratio: '1:1'}}
    // cameraStyle={cameraStyle}
    flashMode={RNCamera.Constants.FlashMode.off}
    reactivate={false}
    cameraStyle={{ height: SCREEN_HEIGHT }}
    customMarker={
      <View style={styles.rectangleContainer}>
        <View style={styles.topOverlay}>
          {/* <Text style={{ fontSize: 30, color: "white" }}>
            QR CODE SCANNER
          </Text> */}
          {/* <View style={{ width: 130, paddingLeft: 10 }}>
            <Button
              title = "Input Manual"
              onPress={() => setModalVisible(true)}
              contentStyle={{ width: 50, height: 50 }}
              // onPress={() =>
              //   navigation.navigate('ScannerDetail')
              // }
            />
          </View> */}
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={styles.leftAndRightOverlay} />

          <View style={styles.rectangle}>
            <Icon
              // name="ios-scan-helper"
              name="md-scan-outline"
              size={SCREEN_WIDTH * 0.625}
              style={{paddingLeft: 10, paddingBottom: 5}}
              color={iconScanColor}
            />
            <Animatable.View
              style={styles.scanBar}
              direction="alternate-reverse"
              iterationCount="infinite"
              duration={1700}
              easing="linear"
              animation={makeSlideOutTranslation(
                "translateY",
                // SCREEN_WIDTH * -0.54
                SCREEN_WIDTH * -0.47
              )}
            />
          </View>

          <View style={styles.leftAndRightOverlay} />
        </View>

        <View style={styles.bottomOverlay}>          
          <Text style={{ fontSize: 15, color: "white", fontWeight: 'bold', paddingTop: 70 }}>
            Powered by ICT SYSDEV
          </Text>
        </View>
        
        {/* <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              // Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Hello World!</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}></Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>TUTUP</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View> */}
      </View>
    }
  />  
  
  )
}

const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "red";

const scanBarWidth = SCREEN_WIDTH * 0.36; // this is equivalent to 180 from a 393 device width default 0.46
const scanBarHeight = SCREEN_WIDTH * 0.0035; //this is equivalent to 1 from a 393 device width default 0.0025
const scanBarColor = "red";

const iconScanColor = "white";


const styles = StyleSheet.create({
  textOri: {
      height: '10%', 
      backgroundColor: '#0070cc', 
      display: 'flex', 
      justifyContent: 'center', 
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
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  },
  //SCRIPT STYLE ANIMASI QR CODE
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  topOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    paddingTop: 20,
    // justifyContent: "center",
    // alignItems: "center",
    paddingBottom: SCREEN_WIDTH * 0.2,
  },

  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    paddingTop: SCREEN_WIDTH * 0.4,
    // paddingBottom: SCREEN_WIDTH * 0.25,
    justifyContent: "center",
    alignItems: "center"
  },

  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.65,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor
  },

  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
})

export default ScannerScreen;