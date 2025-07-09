import { StyleSheet } from "react-native";
import { ThemeType } from "../contexts/ThemeContext";
import { getColors } from "./ThemeColors";

const createSplashScreenStyles = (theme: ThemeType) => {
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 20,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    appName: {
      fontSize: 24,
      color: colors.text,
      fontWeight: "bold",
    },
  });
};

export default createSplashScreenStyles;