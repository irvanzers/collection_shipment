import { useNavigation } from "@react-navigation/core";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";

const Loader = (props) => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      { props.title != undefined &&
        <Appbar>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={props.title != undefined ? props.title : 'Loading...'} />
        </Appbar>
      }
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator animating={true} size="large" color="#2196F3" />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#FFFF'
  },
  horizontal: {
    flexDirection: "row",
    padding: 10
  }
});

export default Loader;