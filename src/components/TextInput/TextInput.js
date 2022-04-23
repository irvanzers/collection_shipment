import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TextInput as Input } from 'react-native-paper'
import Text from '../Text'
export default function TextInput({ errorText, description, right, ...props }) {
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        // selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        right={right && right}
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description} title={description} />
      ) : null}
      {errorText ? <Text style={styles.error} title={errorText} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  }
})