import React, {} from 'react';
import { LogBox, StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/routes/RootNavigator';
import { store, persistor} from './src/redux/store/store';
import { verifyToken } from './src/redux/services/authService';
import { bgPrimary } from './src/redux/constants/constant';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import 'react-native-gesture-handler';
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

// store.dispatch(verifyToken());

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4077c4',
    secondary: '#DCDCDC',
    accent: '#888',
    error: '#f13a59',
  },
};

const App = () => {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <StatusBar backgroundColor="#4077c4" barStyle="light-content" />
          <RootNavigator />
        </PaperProvider>
      </NavigationContainer>
    </Provider>      
  )
}

export default App;