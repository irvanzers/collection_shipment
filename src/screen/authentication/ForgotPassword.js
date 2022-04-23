import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'

import {useForm, Controller} from 'react-hook-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as apiAction from './../../redux/actions/apiAction';
import * as crudAction from './../../redux/actions/crudAction';
import * as flashMessage from './../../redux/actions/flashMessage';
import * as authService from './../../redux/services/authService';
import Common from './../../redux/constants/common';

import Toast from 'react-native-simple-toast';
import Text from './../../component/Text';
import Logo from '../../component/Logo/Logo'
import { getUuid } from './../../redux/utils/actionUtil';

import { Button, Appbar, IconButton } from 'react-native-paper';
import TextInput from './../../component/TextInput/TextInput'
import { theme } from '../../redux/constants/theme'
import FacebookButton from './social/FacebookButton'
import GoogleButon from './social/GoogleButton';
import LoaderModal from '../../component/Loader/LoaderModal';

const ForgotPassword =  (props) => {
  const [loading, setLoading] = useState(false);
  
  const {
    control, 
    handleSubmit, 
    formState: {errors, isValid}
  } = useForm({mode: 'onBlur'})

  const onSubmit = async (data) => {
    setLoading(true)
    try {
        await props.actions.storeItem(Common.RESET_PASSWORD, data);
    } catch (error) {
        alert(error)
    } finally {
        setLoading(false)
    }
  }
  
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Appbar>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Appbar.Content title={'Lupa Password'} />
      </Appbar>
      <View style={styles.container}>
        <LoaderModal loading={loading} />
        <Text title={'Masukan alamat email anda agar mendapatkan password baru anda.'} style={{textAlign: 'center', color: theme.colors.accent}} p />
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
                message: 'Field is required!'
            },
            pattern:{
                value: /\S+@\S+\.\S+/,
                message: 'Ooops! We need a valid email address.'
            }
            }} 
        />
        <View style={{width: '100%', marginTop: 10}}>
            <Button mode="contained" fullWidth disabled={loading} loading={loading} contentStyle={{height: 50}} onPress={handleSubmit(onSubmit)}>
            Reset Password
            </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
