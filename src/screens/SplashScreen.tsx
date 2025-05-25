import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../styles/SplashScreenStyles";

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

export default SplashScreen;