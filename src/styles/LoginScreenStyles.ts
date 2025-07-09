import { StyleSheet } from "react-native";
import { ThemeType } from "../contexts/ThemeContext";
import { getColors } from "./ThemeColors";

const createLoginScreenStyles = (theme: ThemeType) => {
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 24,
      color: colors.text,
      textAlign: "center",
    },
    label: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      height: 48,
      borderColor: "#CCC",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.card,
      marginBottom: 16,
      color: colors.text,
    },
    button: {
      marginTop: 16,
    },
    link: {
      marginTop: 24,
      textAlign: "center",
      color: colors.accent,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: "#CCC",
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: colors.card,
      marginBottom: 16,
      paddingHorizontal: 12,
    },
    passwordInput: {
      flex: 1,
      height: 48,
      color: colors.text,
    },
    toggle: {
      marginLeft: 12,
      color: colors.accent,
      fontWeight: "500",
    },
  });
};

export default createLoginScreenStyles;