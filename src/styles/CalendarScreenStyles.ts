import { StyleSheet } from "react-native";
import { ThemeType } from "../contexts/ThemeContext";
import { getColors } from "./ThemeColors";

const getCalendarScreenStyles = (theme: ThemeType) => {
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    titleToday: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.primary,
      textAlign: "center",
      marginBottom: 10,
    },
    titleCalendar: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.primary,
      textAlign: "center",
      marginVertical: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 8,
      color: colors.text,
    },
    eventCard: {
      backgroundColor: colors.card,
      padding: 16,
      marginVertical: 8,
      borderRadius: 12,
      borderLeftWidth: 6,
      borderLeftColor: "#ccc", 
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    eventName: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 4,
      color: colors.cardText,
    },
  });
};

export default getCalendarScreenStyles;