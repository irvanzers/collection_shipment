import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('./../../assets/gpl-logo.png')} resizeMethod="auto" resizeMode="contain" style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 240,
    height: 90,
    marginBottom: 20,
  },
})