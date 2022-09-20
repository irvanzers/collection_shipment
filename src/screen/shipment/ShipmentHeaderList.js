import React, { useState, useEffect, useCallback, useRef, useMemo }  from 'react'
import { Dimensions, View, StyleSheet, FlatList, Alert, InteractionManager } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker';
import Text from './../../components/Text';
import { Card, Title, Colors, Appbar, ProgressBar, Button, IconButton } from 'react-native-paper';
import moment from 'moment';
import List from './../../components/MenuList/List';
import { useNavigation } from '@react-navigation/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _, { reduce } from 'lodash';
import * as apiAction from './../../redux/actions/apiAction';
import * as crudAction from '../../redux/actions/crudAction';
import * as flashMessage from '../../redux/actions/flashMessage';
import * as authService from './../../redux/services/authService';
import Common from './../../redux/constants/common';
import { theme } from '../../redux/constants/theme';
import {getUuid, setUuid} from './../../redux/utils/actionUtil';

// moment.tz.setDefault("Asia/Jakarta");
const SCREEN_WIDTH = Dimensions.get('window').width;

const ShipmentHeaderList = ( props ) => {
  const { shipmentheader } = props;
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(true);
  
  const onBackPage = () => { props.navigation.goBack(); props.route.params.onBackPage(); };

  const handlePress = () => setExpanded(!expanded);
  const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
      dispatch(fetchGetVisitHistory({
          visit_date: Moment(currentDate).format('YYYY-MM-DD'),
          user_id: selectCourier
      }))
  };
  const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
  };
  const showDatepicker = () => {
      showMode('date');
  };
  
  const loadData = async() => {
      try {
          // await props.actions.fetchAll(Common.SHIPMENT_DATA);   
          await props.actions.fetchAll(Common.SHIPMENT_HEADER_LIST);        
      } catch (error) {
          alert(error)
      } finally {
          
      }
  }
  const onGoBack = () => {
    loadData();
  }
  useEffect(() => {
      const interactionPromise = InteractionManager.runAfterInteractions(() => {
          loadData()
      });
      return () => interactionPromise.cancel();
  },[])
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const listshipmentheader = shipmentheader ? shipmentheader : [];
//   console.log(listshipmentheader);
  
  const renderTopItem = ({}) => {
      return(
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
              <View flexDirection="row" style={{ justifyContent: 'space-between' }}>
                  <View style={{ justifyContent: 'center' }}>
                      <Text title={`TANGGAL : ${moment(date).format('YYYY-MM-DD')}`} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                  </View>
              </View>
          </View>
        </View>  

      )
  }

  const itemView = ({ item, index }) => {
//   = useCallback(({ item }) => {
//     const start_check = moment(item.start_date, 'YYYY-MM-DD');
//     const month_start = start_check.format('M');
//     const year_start = start_check.format('YYYY');
    return(        
        <View style={{ paddingTop: 10}}>
        <Card 
            key={index}
            onPress={() => navigation.push('ShipmentList', {data: item.id, onBackp: () => onGoBack()})}
        >
        {/* // style={month_now == month_start && year_now == year_start ? null : styles.nonActive} > */}
            <Card.Title     
                title={<Text title={item.header_date} style={{ color: 'white' }} p />}
                style={styles.colorBox}
            />
            <Card.Content style={styles.viewBox}>
                <View style={styles.viewBox}>
                    <View style={styles.viewLitBox}>
                        <Text title={item.total_customer} style={styles.textLeft} h2 bold />
                        <Text title="OUTLET" style={styles.textLeft} p bold />
                    </View>
                    <View style={{ paddingLeft: 10, width: '60%' }}>
                        <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                            <ProgressBar progress={item.job_progress} color={item.prog_color} style={{ height: 20 }} />
                            <Text title={`PROGRESS ${(item.job_progress * 100).toFixed(2)}%`} style={{ color: 'white', paddingTop: 0, marginTop: 0, alignItems: 'center' }} p italic />
                        </View>
                        <Text title={item.job_status} style={[styles.approve, {backgroundColor: `${item.job_color}`, color: `${item.job_text}`}]} p bold />
                    </View>
                </View>
            </Card.Content>
        </Card>
        </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>      
      <Appbar.Header>
          <Appbar.BackAction onPress={() => onBackPage()} />
          <Appbar.Content title={'HEADER LIST PENGIRIMAN'} />
          {/* <Appbar.Action icon={'calendar'} onPress={showDatepicker} /> */}
      </Appbar.Header>
      
      <View style={{ flex: 1 }}>
        <View style={{ padding: 10 }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                horizontal={false}
                data={listshipmentheader}
                keyExtractor={keyExtractor}
                // ItemSeparatorComponent={renderSeparator}
                ListHeaderComponent={renderTopItem}
                renderItem={itemView}
                initialNumToRender={10}
            />
        </View>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    colorBox: {
        backgroundColor: '#4AB5E5',
        color: 'white'
    },
    viewBox: { 
        flexDirection: 'row', 
        width: SCREEN_WIDTH,
        backgroundColor: '#4AB5E5',
    },
    viewLitBox: { 
        alignItems: 'center', 
        borderRightColor: 'grey', 
        borderRightWidth: .5, 
        paddingRight: 12,
        width: '25%'
    },
    textLeft: { 
        color: 'white', 
        paddingBottom: 0, 
        marginBottom: 0 
    },
    approve: { 
        padding: 3, 
        marginTop: 0, 
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: 228,
        padding: 10,
        alignItems: 'center'
    },
    nonActive: { 
        backgroundColor: '#98999a96', 
        color: 'white' 
    }
})

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        apiState: state.api,
        message: state.flash.message,
        shipmentheader: state.crud.shipmentheaders,
        shipmentsdraft: state.crud.shipmentsdrafts,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(_.assign({}, authService, crudAction, apiAction, flashMessage), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipmentHeaderList);