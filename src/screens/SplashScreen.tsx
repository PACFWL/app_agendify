import React, { useContext } from "react";
import { View, Text, Image } from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import { getColors } from "../styles/ThemeColors";
import createStyles from "../styles/SplashScreenStyles";

const SplashScreen = () => {
  const { theme } = useContext(ThemeContext);
  const colors = getColors(theme);
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.jpeg")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appName}>Agendify</Text>
    </View>
  );
};

export default SplashScreen;