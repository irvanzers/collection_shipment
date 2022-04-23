import React, { useCallback, useState, useEffect }  from 'react'
import { Button, View, StyleSheet, FlatList, InteractionManager } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker';
import Loading from './../../components/Loading';
import Text from './../../components/Text';
import { Card, Title, Colors, Appbar } from 'react-native-paper';
import Moment from 'moment';
import List from './../../components/MenuList/List';
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

const CollectionList = ( props ) => {
  const { collectiondata, collectionlistdetail }=props; 
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handlePress = () => setExpanded(!expanded);
  
  const loadData = async() => {  
    try {
        const datasubmit = {
            header_id: props.route.params.data
        }
        // await props.actions.fetchAll(Common.COLLECTION_DATA);    
        await props.actions.fetchAll(Common.COLLECTION_LIST_DETAIL, datasubmit);
        setIsLoading(false);  
    } catch (error) {
        alert(error)
    } finally {
        setIsLoading(false);        
    }
}
useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
        loadData()
    });
    return () => interactionPromise.cancel();
},[])
const keyExtractor = useCallback((item, index) => index.toString(), []);
const listcollection = collectionlistdetail ? collectionlistdetail.assigned_data : [];
const assignedarcount = collectionlistdetail ? collectionlistdetail.assigned_ar_count : [];
const assignedcount = collectionlistdetail ? collectionlistdetail.assigned_count : [];
const statusheader = collectionlistdetail ? collectionlistdetail.header_status : [];
// console.log(statusheader);

    const renderTopItem = ({}) => {
        return(
            <View style={{flex:1}}>
            <View flexDirection="row" style={{height: 40, justifyContent: 'space-between',  paddingLeft: 10,  backgroundColor: 'white'}}>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TANGGAL : ${statusheader.header_date}`} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                </View>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TOTAL OUTLET: `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginRight: 10}}>
                        <Text title={assignedcount} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                    </View>
                </View>
            </View>
            <View flexDirection="row" style={{height: 40, justifyContent: 'space-between',paddingBottom: 15,  paddingLeft: 10,  backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: .5}}>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`STATUS : ${statusheader?.status}`} p style={{ textTransform: 'uppercase', color: `${statusheader ? statusheader.color : 'grey'}` }} />
                    </View>
                </View>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TOTAL TAGIHAN(AR): `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginRight: 10}}>
                        <Text title={assignedarcount} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                    </View>
                </View>
            </View>
            {/* { collectiondraft.id == '' &&
                <View style={{alignItems: 'center', marginTop: 10}}>
                    <Text title={'DATA TAGIHAN TIDAK DITEMUKAN'} p style={{color: 'grey'}} />
                </View>
            } */}   
        </View>
        )
    }

    const renderCategory = ({item, index}) => {
        return (
            <>
                { item.job_status <= 1 ?
                    <View flexDirection="row" style={{marginVertical: 5}}>                
                        <View style={[styles.viewLine, { paddingTop: 0 }]} />
                        <View style={styles.divider} />
                        <List
                            nav="CollectionDetail"  
                            item={item}
                            iconList="briefcase-check"
                            color={'grey'}
                            title={item.cust_name}
                            sizeIcon={28}
                        />
                    </View>
                    : (
                    <View flexDirection="row" style={{marginVertical: 5}}>                
                        <View style={[styles.viewLine, { paddingTop: 0 }]} />
                        <View style={styles.divider} />
                        <List
                            style={{backgroundColor: '#C8C8C8'}}
                            nav="CollectionDetail"
                            item={item}
                            iconList={"briefcase-check"}
                            color={'green'}
                            title={item.cust_name}
                            sizeIcon={30}
                        />
                    </View>
                    )}
            </>
        )
    }

  return (
    <View>      
      <Appbar.Header>
          <Appbar.BackAction onPress={() => props.navigation.goBack()} />
          <Appbar.Content title={'LIST TAGIHAN'} />
          <Appbar.Action
                icon={'barcode-scan'} 
                onPress={() => props.navigation.navigate('ScannerScreen')}
          />
      </Appbar.Header>     
      <Loading loading={isLoading} /> 
    
        <FlatList style={styles.list}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            initialNumToRender={3}
            data={listcollection}
            ListHeaderComponent={renderTopItem}
            keyExtractor={keyExtractor}
            renderItem={renderCategory}
        />
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


function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        apiState: state.api,
        message: state.flash.message,
        collectiondata: state.crud.collectiondatas,
        collectionlistdetail: state.crud.collectionlistdetails,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(_.assign({}, authService, crudAction, apiAction, flashMessage), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionList)