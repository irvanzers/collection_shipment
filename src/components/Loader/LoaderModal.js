import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ActivityIndicator
} from 'react-native';

const LoaderModal = props => {
  const {
    loading,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => { console.log('close modal') }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <View>
            <ActivityIndicator animating={loading} size="large" color="#2196F3" />
          </View>
        </View>
      </View>
    </Modal>
  )
}


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    height: 50,
    width: 50,
    backgroundColor: 'white',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 9999
  }
});

export default LoaderModal;
