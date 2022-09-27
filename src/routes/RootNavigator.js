import * as React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useSelector } from "react-redux";
import { getToken } from '../redux/utils/actionUtil';

const Stack = createStackNavigator();

import HomeScreen from '../screen/home/HomeScreen';
import LoginScreen from '../screen/authentication/LoginScreen';
import ScannerScreen from '../screen/scanner/ScannerScreen';
import ShipmentDetail from '../screen/shipment/ShipmentDetail';
import ShipmentHeaderList from '../screen/shipment/ShipmentHeaderList';
import ShipmentList from '../screen/shipment/ShipmentList';
import CollectionHeaderList from '../screen/collections/CollectionHeaderList';
import CollectionList from '../screen/collections/CollectionList';
import CollectionPickPayment from '../screen/collections/CollectionPickPayment';
import CollectionDetail from '../screen/collections/CollectionDetail';
import CollectionPayment from '../screen/collections/CollectionPayment';
import OthersIndex from '../screen/others/OthersIndex';
import OthersProfile from '../screen/others/OthersProfile';
import ShipmentAbsenCar from '../screen/shipment/ShipmentAbsenCar';
import ShipmentShipConfirm from '../screen/shipment/ShipmentShipConfirm';

const RootNavigator = (props) => {
  const auth = useSelector((state) => {
    const stateAuth = state.auth
    return stateAuth
  });
  getToken().then(rest => console.log(rest))
  console.log(auth)
  return (
    <Stack.Navigator>  
    { !auth.isAuthenticated ? (
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />   
    ) : (
      <>
        <Stack.Screen
          name="Beranda"
          component={HomeScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        {/* <Stack.Screen
          name="Beranda"
          component={HomeScreen}
          options={{
            headerLeft: () => <></>,
            headerStyle: {
              backgroundColor: '#4077c4',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />    */}
        <Stack.Screen
          name="ScannerScreen"
          component={ScannerScreen}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#4077c4',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />       
        <Stack.Screen
          name="ShipmentDetail"
          component={ShipmentDetail}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        <Stack.Screen
          name="ShipmentHeaderList"
          component={ShipmentHeaderList}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        <Stack.Screen
          name="ShipmentList"
          component={ShipmentList}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        <Stack.Screen
          name="CollectionHeaderList"
          component={CollectionHeaderList}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        <Stack.Screen
          name="CollectionList"
          component={CollectionList}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        <Stack.Screen
          name="CollectionDetail"
          component={CollectionDetail}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        <Stack.Screen
          name="CollectionPayment"
          component={CollectionPayment}
          options={{
            title: 'PAYMENT COLLECTION',
            headerStyle: {
              backgroundColor: '#4077c4',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        <Stack.Screen
          name="CollectionPickPayment"
          component={CollectionPickPayment}
          options={{
            title: 'PAYMENT LIST',
            headerStyle: {
              backgroundColor: '#4077c4',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        <Stack.Screen
          name="OthersIndex"
          component={OthersIndex}
          options={{
            title: 'LAINNYA',
            headerStyle: {
              backgroundColor: '#4077c4',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        <Stack.Screen
          name="OthersProfile"
          component={OthersProfile}
          options={{
            title: 'PROFILE',
            headerStyle: {
              backgroundColor: '#4077c4',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        <Stack.Screen
          name="ShipmentAbsenCar"
          component={ShipmentAbsenCar}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
        <Stack.Screen
          name="ShipmentShipConfirm"
          component={ShipmentShipConfirm}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        /> 
      </>
    )}
    </Stack.Navigator>
  );
}

export default RootNavigator