import React, { useState, useEffect }  from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'

import MenuHome from '../../components/Menu/MenuHome';
import Text from '../../components/Text';
import List from '../../components/MenuList/List';
import { Card, Title, Paragraph, TextInput, IconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../constants/theme';


const CollectionPickPayment = ( props ) => {

  return (
    <View style={{flex:1, width: '100%'}}>
    <ScrollView
        style={{flex:1}}
        showsVerticalScrollIndicator={false}
        horizontal={false}
    >
            
      <View style={[styles.viewLine, { paddingTop: 10 }]} />
        <View style={styles.divider} />
        <List
          nav="CollectionDetail"
          iconList="post-outline"
          title="Tukar Faktur"
          fontSize={23}
          sizeIcon={80}
          height={150}
        />            
        <View style={[styles.viewLine, { paddingTop: 10 }]} />
          <View style={styles.divider} />
          <List
            nav="CollectionDetail"
            iconList="briefcase-check-outline"
            title="Giro Bank"
            fontSize={23}
            sizeIcon={80}
            height={150}
          />
            
        <View style={[styles.viewLine, { paddingTop: 10 }]} />
          <View style={styles.divider} />
          <List
            nav="CollectionDetail"
            iconList="cash"
          //   color={}
            title="Pembayaran Tunai"
            fontSize={23}
            sizeIcon={80}
            height={150}
          />
      {/* <View style={{ paddingHorizontal: 10, paddingTop: 10, justifyContent: 'center'}}>
        <Card style={{ alignItems: 'center' }}>
          <Card.Content
            style={{boxShadow: '0px 3px 5px -1px rgba(80,80,80, 0.2),0px 5px 8px 0px rgba(80,80,80, 0.14),0px 1px 14px 0px rgba(80,80,80, 0.12)', shadowColor: '#easade',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            elevation: 1
            }}
          >      
            <View flexDirection="row" style={{justifyContent: 'space-around', marginTop: 10,}}>
                <MenuHome item={{
                    text: 'Tukar Faktur',
                    image: require(`./../../assets/icon-shipment.png`),
                    onNavigation: () => props.navigation.navigate('ShipmentList')
                }} />
                <MenuHome item={{
                    text: 'Giro',
                    image: require(`./../../assets/icon-collection.png`),
                    onNavigation: () => props.navigation.navigate('CollectionList')
                }} />
          </View>
            <View flexDirection="row" style={{justifyContent: 'space-around', marginTop: 10,}}>
                <MenuHome item={{
                    text: 'Tunai',
                    image: require(`./../../assets/icon-shipment.png`),
                    onNavigation: () => props.navigation.navigate('ShipmentList')
                }} />
          </View>
          </Card.Content>
        </Card>
      </View> */}
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  divider: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#C8C8C8',
  },
  listMenu: {
      flexDirection: 'row',
      padding: 10,
      width: '100%',
      height: 150,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white'
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
  viewBox: {
      marginTop: 10, 
      backgroundColor: '#ffff', 
      padding: 10
  }
})

export default CollectionPickPayment;