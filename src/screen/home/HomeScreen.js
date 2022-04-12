import React  from 'react'
import { Button, View, ImageBackground, ScrollView } from 'react-native'

import MenuHome from './../../components/Menu/MenuHome';
import Text from './../../components/Text';

const HomeScreen = (props) => {
  
  const mustLogin = () => {
    if(props.isAuthenticated){
        props.navigation.navigate('LoginScreen')
    } else {
        props.navigation.navigate('ScannerScreen')
    }
  }
  const Logout = () => {
    if(props.isAuthenticated){
        props.navigation.navigate('ScannerScreen')
    } else {
        props.navigation.navigate('LoginScreen')
    }
  }
  // const { navigate } = this.props.navigation;
  return (
    <View style={{flex:1}}>      
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
              <View style={{marginTop: 80, paddingLeft: 10}}>
                  <Text title=" " h6 style={{color: '#0000'}} />
                  <Text title="Collection & Shipment" h6 style={{color: '#ffff'}} />
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
  )
}

export default HomeScreen;