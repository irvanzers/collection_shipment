import React, { useState, useEffect }  from 'react'
import { Button, View, StyleSheet, FlatList } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker';
import Text from './../../components/Text';
import { Card, Title, Colors, Appbar, ProgressBar } from 'react-native-paper';
import Moment from 'moment';
import List from './../../components/MenuList/List';


const ShipmentHeaderList = ( props ) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);
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
          <Appbar.Content title={'HEADER LIST PENGIRIMAN'} />
          <Appbar.Action icon={'calendar'} onPress={showDatepicker} />
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
            {/* <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text title={`TOTAL OUTLET: `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                </View>
                <View style={{ justifyContent: 'center', marginRight: 10}}>
                    <Text title={`2`} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                </View>
            </View> */}
        </View>
        {/* { visithistory.visit_history == '' &&
            <View style={{alignItems: 'center', marginTop: 10}}>
                <Text title={'DATA KUNJUNGAN TIDAK DITEMUKAN'} p style={{color: 'grey'}} />
            </View>
        } */}
           
           <View style={{ paddingTop: 10}}>
    <Card 
        // key={index}
        // onPress={() => navigation.push('ShipmentList', {data: item.id, onBackp: () => onGoBack()})}
        onPress={() => navigation.push('ShipmentList')}
    >
    {/* // style={month_now == month_start && year_now == year_start ? null : styles.nonActive} > */}
        <Card.Title     
            title={<Text title={'2022-08-03'} style={{ color: 'white' }} p />}
            style={styles.colorBox}
        />
        <Card.Content style={styles.viewBox}>
            <View style={styles.viewBox}>
                <View style={styles.viewLitBox}>
                    <Text title={'2'} style={styles.textLeft} h2 bold />
                    <Text title="OUTLET" style={styles.textLeft} p bold />
                </View>
                <View style={{ paddingLeft: 10, width: '60%' }}>
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <ProgressBar progress={'0'} color={'grey'} style={{ height: 20 }} />
                        <Text title={`PROGRESS 10%`} style={{ color: 'white', paddingTop: 0, marginTop: 0, alignItems: 'center' }} p italic />
                    </View>
                    <Text title={'ON PROGRESS'} style={[styles.approve, {backgroundColor: `grey`, color: `white`}]} p bold />
                </View>
            </View>
        </Card.Content>
    </Card>
    </View>

    <View style={[styles.viewLine, { paddingTop: 10 }]} />
        <View style={styles.divider} />
        <List
          nav="ShipmentList"
          iconList="book"
          title="30 Maret 2022"
          sizeIcon={28}
        />
        
        {/* <List.Section title="Accordions">
        <List.Accordion
            title="Controlled Accordion"
            left={props => <List.Icon {...props} icon="folder" />}
            expanded={expanded}
            onPress={handlePress}>
            <List.Item title="First item" />
            <List.Item title="Second item" />
        </List.Accordion>
        </List.Section> */}

    <View style={[styles.viewLine, { paddingTop: 10 }]} />
        <View style={styles.divider} />
        <List
          nav="ShipmentList"
          iconList="book"
        //   color={}
          title="29 Maret 2022"
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

export default ShipmentHeaderList;