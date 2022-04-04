import React, { useState, useEffect }  from 'react'
import { Button, View, StyleSheet, FlatList } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker';
import Text from './../../components/Text';
import { Card, Title, Colors, Appbar } from 'react-native-paper';
import Moment from 'moment';
import List from './../../components/MenuList/List';


const ShipmentList = ( props ) => {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        dispatch(fetchGetVisitHistory({
            visit_date: Moment(currentDate).format('YYYY-MM-DD'),
            user_id: selectKowil
        }))
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showDatepicker = () => {
        showMode('date');
    };

  return (
    <View>
      
      <Appbar.Header>
          <Appbar.BackAction onPress={() => props.navigation.goBack()} />
          <Appbar.Content title={'LIST PENGIRIMAN'} />
          <Appbar.Action
                icon={'briefcase-account-outline'} 
                onPress={() => props.navigation.navigate('AbsenMobil')}
          />
          <Appbar.Action
                icon={'barcode-scan'} 
                onPress={() => props.navigation.navigate('ScannerScreen')}
          />

          {/* <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={<Appbar.Action icon={'dots-vertical'} onPress={openMenu} color={'white'} />}>
                  {visithistory != '' && visithistory.kowil.map((item, index) => {
                      return(
                          <Menu.Item 
                              key={index.toString()} 
                              onPress={() => onSelect(item)} 
                              title={`${item.kowil_code}`} 
                              subtitle={`${item.name}`} 
                          />
                      )
                  })}
          </Menu> */}
      </Appbar.Header>
      
      <View style={{flex:1}}>
        {show && (
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
            />
        )}
        <View flexDirection="row" style={{height: 40, justifyContent: 'space-between',  paddingLeft: 10,  backgroundColor: 'white'}}>
            <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text title={`TANGGAL : ${Moment(date).format('YYYY-MM-DD')}`} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                </View>
                {/* <View style={{ justifyContent: 'center', marginRight: 10}}>
                    <Text title={`${selectCode}`} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                </View> */}
            </View>
            <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text title={`TOTAL OUTLET: `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                </View>
                <View style={{ justifyContent: 'center', marginRight: 10}}>
                    <Text title={`2`} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                </View>
            </View>
        </View>
        <View flexDirection="row" style={{height: 40, justifyContent: 'space-between',paddingBottom: 15,  paddingLeft: 10,  backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: .5}}>
            <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text title={`STATUS : OPEN`} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                </View>
            </View>
            <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text title={`TOTAL TAGIHAN(AR): `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                </View>
                <View style={{ justifyContent: 'center', marginRight: 10}}>
                    <Text title={`8`} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                </View>
            </View>
        </View>
        {/* { visithistory.visit_history == '' &&
            <View style={{alignItems: 'center', marginTop: 10}}>
                <Text title={'DATA KUNJUNGAN TIDAK DITEMUKAN'} p style={{color: 'grey'}} />
            </View>
        } */}
    
    <View style={[styles.viewLine, { paddingTop: 10 }]} />
        <View style={styles.divider} />
        <List
          nav="ShipmentDetail"
          iconList="package-variant-closed"
          title="PT. Sangkuriang - 80142"
          sizeIcon={28}
        />
    <View style={[styles.viewLine, { paddingTop: 10 }]} />
        <View style={styles.divider} />
        <List
          nav="ShipmentDetail"
          iconList="package-variant-closed"
        //   color={}
          title="PT. Sangkuriang - 80141"
          sizeIcon={28}
        />
    </View>
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

export default ShipmentList;