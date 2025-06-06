import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {  
      flex: 1,
      padding: 16,
      backgroundColor: "#f5f5f5"
     },
    header: {  
      fontSize: 22,
      fontWeight: "bold",
      color: "#1E88E5",
      marginBottom: 16,
      textAlign: "center"
     },
    subHeader: { 
      fontSize: 18,
      fontWeight: "bold",
      color: "#1E88E5",
      marginBottom: 16,
      textAlign: "center"
     },
    section: { 
      marginBottom: 20 
     },
    buttonRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
    button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    },
    primaryButton: {
      backgroundColor: "#1E88E5",
    },
    warningButton: {
      backgroundColor: "#FFA726",
    },
    dangerButton: {
      backgroundColor: "#E53935",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    detailCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
    detail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  });

  export default styles;