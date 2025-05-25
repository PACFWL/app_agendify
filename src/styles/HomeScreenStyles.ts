import { StyleSheet } from "react-native";
import { ThemeType } from "../contexts/ThemeContext";
import { getColors } from "./ThemeColors";

const getHomeScreenStyles = (theme: ThemeType) => {
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    welcome: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 16,
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 24,
      marginBottom: 12,
      color: colors.primary,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: "#ccc",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 4,
      color: colors.cardTitle,
    },
    cardText: {
      fontSize: 14,
      color: colors.cardText,
    },
    statusTag: {
      alignSelf: "flex-start",
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 8,
      fontWeight: "bold",
      marginTop: 4,
      color: colors.statusText,
      fontSize: 12,
    },
    noEventText: {
      fontSize: 14,
      color: colors.noEventText,
      fontStyle: "italic",
      marginLeft: 10,
      marginBottom: 10,
    },
  });
};

export default getHomeScreenStyles;
