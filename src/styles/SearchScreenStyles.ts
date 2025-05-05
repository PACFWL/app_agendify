import { StyleSheet } from "react-native";

const SearchScreenStyles = StyleSheet.create({
    container: { padding: 16, flex: 1 },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    title: { fontSize: 22, fontWeight: "bold" },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 8,
      marginBottom: 10,
      borderRadius: 8,
    },
    eventItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderColor: "#eee",
    },
    eventTitle: {
      fontWeight: "bold",
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 4,
      marginBottom: 12,
    },
    label: {
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 6,
      color: "#444",
    },   
  });

  export default SearchScreenStyles;