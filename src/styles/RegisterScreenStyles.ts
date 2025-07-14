import { StyleSheet } from "react-native";
import { ThemeType } from "../contexts/ThemeContext";
import { getColors } from "./ThemeColors";

const createRegisterScreenStyles = (theme: ThemeType) => {
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: colors.primary,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 6,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      marginBottom: 15,
      backgroundColor: colors.card,
      fontSize: 14,
    },
    pickerContainer: {
      backgroundColor: colors.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      marginBottom: 10,
      overflow: "hidden",
    },
    addButton: {
      backgroundColor: "#1976d2",
      marginTop: 10,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
    },
    addButtonText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 14,
    },
    link: {
      marginTop: 24,
      textAlign: "center",
      textDecorationLine: "underline",
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
       toggle: {
      marginLeft: 12,
      color: colors.accent,
      fontWeight: "500",
    },
       passwordInput: {
      flex: 1,
      height: 48,
      color: colors.text,
    },
  });
};

export default createRegisterScreenStyles;