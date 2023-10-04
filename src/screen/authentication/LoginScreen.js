import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { useForm, Controller } from 'react-hook-form'

import Text from '../../components/Text';
import TextInput from '../../components/TextInput/TextInput';
import Logo from '../../components/Logo/Logo';
import LoaderModal from '../../components/Loader/LoaderModal';
import { Button } from 'react-native-paper';
import { theme } from '../../redux/constants/theme';
import { useNavigation } from '@react-navigation/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUuid } from './../../redux/utils/actionUtil';
import _ from 'lodash';
import * as apiAction from './../../redux/actions/apiAction';
import * as crudAction from './../../redux/actions/crudAction';
import * as flashMessage from './../../redux/actions/flashMessage';
import * as authService from './../../redux/services/authService';
import Toast from 'react-native-simple-toast';

const LoginScreen = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {
    control, 
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({mode: 'onBlur'})
  
  const onSubmit = async (data) => {
    setLoading(false)
    try {
      const login = await props.actions.login({email: data.email, password: data.password})
      if(login.success) {
        await props.actions.removeFlashMessage();
        await props.actions.apiClearState();
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      } else {
        Toast.show(login?.data?.message, Toast.LONG);
        await props.actions.removeFlashMessage();
        await props.actions.apiClearState();
      }
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
    <LoaderModal loading={loading} />
    <Logo />
    <Controller        
      control={control}        
      name="email"        
      render={({field: {onChange, value, onBlur}}) => (    
        <TextInput
          label="Email"
          returnKeyType="next"
          value={value}
          onChangeText={value => onChange(value)}
          error={errors.email}
          errorText={errors?.email?.message}
          onBlur={onBlur}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />       
      )}
      rules={{
        required: {
          value: true,
          message: 'Email harus diisi!'
        },
        pattern:{
          value: /\S+@\S+\.\S+/,
          message: 'Ooops! Alamat email anda tidak valid.'
        }
      }} 
      />
      <Controller        
        control={control}        
        name="password"        
        render={({field: {onChange, value, onBlur}}) => ( 
          <TextInput
            label="Password"
            returnKeyType="done"
            value={value}
            onChangeText={value => onChange(value)}
            error={errors.password}
            errorText={errors?.password?.message}
            onBlur={onBlur}
            secureTextEntry
          />
        )}
        rules={{
          required: {
            value: true,
            message: 'Password harus diisi!'
          },
        }} 
      />
      <View style={{width: '100%', marginTop: 10}}>
        <Button mode="contained" fullWidth disabled={loading} loading={loading} contentStyle={{height: 50}} onPress={handleSubmit(onSubmit)}>
          LOGIN
        </Button>
      </View>      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  forgotPassword: {
    color: theme.colors.secondary,
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 10,
    marginTop: 10
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  forgot: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})

function mapStateToProps(state) {
  return {
      isAuthenticated: state.auth.isAuthenticated,
      apiState: state.api,
      message: state.flash.message,
  }
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(_.assign({}, crudAction, apiAction, flashMessage, authService), dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)