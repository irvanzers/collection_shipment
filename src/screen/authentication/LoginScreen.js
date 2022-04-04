import * as React  from 'react'
import { Button, StyleSheet, View } from 'react-native'
import { useForm, Controller } from 'react-hook-form'

import TextInput from './../../components/TextInput/TextInput'
import Logo from '../../components/Logo/Logo'

const LoginScreen = ( {navigation} ) => {
  const {
    control, 
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({mode: 'onBlur'})

  return (
    <View style={styles.container}>
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
          message: 'Field is required!'
        },
        pattern:{
          value: /\S+@\S+\.\S+/,
          message: 'Ooops! We need a valid email address.'
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
            message: 'Field is required!'
          },
        }} 
      />
      <View style={{width: '100%', marginTop: 10}}>
        <Button
          title = "Login"
          contentStyle={{height: 50}}
          onPress={() =>
            navigation.navigate('Beranda')
          }
        />
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
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
})

export default LoginScreen;