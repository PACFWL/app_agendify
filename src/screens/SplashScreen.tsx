import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
  
      <Image
        source={require("../assets/logo.jpeg")} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appName}>Minha Agenda</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SplashScreen;