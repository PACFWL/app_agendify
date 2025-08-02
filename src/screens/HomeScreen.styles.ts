import { StyleSheet } from "react-native";
import { ThemeType } from "../contexts/ThemeContext";
import { getColors } from "../styles/ThemeColors.styles";

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
    summaryContainer: {
  marginVertical: 12,
  padding: 12,
  borderRadius: 8,
  backgroundColor: colors.card,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
summaryText: {
  fontSize: 14,
  fontWeight: "600",
  marginBottom: 4,
  color: colors.cardText,
},
alertBox: {
  backgroundColor: "#fff3cd",
  borderLeftWidth: 4,
  borderLeftColor: "#ffc107",
  padding: 12,
  borderRadius: 8,
  marginVertical: 12,
},
alertTitle: {
  fontWeight: "bold",
  fontSize: 16,
  marginBottom: 6,
  color: "#856404",
},
alertText: {
  fontSize: 14,
  color: "#856404",
  marginBottom: 4,
},
statusSummaryContainer: {
  marginTop: 16,
  marginBottom: 8,
  padding: 12,
  borderRadius: 8,
  backgroundColor: colors.card,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
},

statusRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 6,
},

statusIndicator: {
  width: 12,
  height: 12,
  borderRadius: 6,
  marginRight: 8,
},

statusLabel: {
  fontSize: 14,
  color: colors.cardText,
},
tag: {
  color: "white",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 14,
  fontSize: 12,
  fontWeight: "600",
  overflow: "hidden",
  textAlign: "center",
},
  tagsRow: {
  flexDirection: "row",
  marginTop: 6,
  gap: 8,
  flexWrap: "wrap",
},
locationRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 4,
},
locationName: {
  fontSize: 13,
},
locationFloor: {
  fontSize: 13,
  color: "#555",
},
locationTag: {
  fontSize: 12,
  color: "#fff",
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  overflow: "hidden",
},
dateText: {
  fontSize: 16,
  fontWeight: "500",
  color: colors.cardText,
  marginBottom: 12,
  textAlign: "center",
},
  });
};

export default getHomeScreenStyles;
