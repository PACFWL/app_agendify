import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

    container: { 
      flex: 1, 
      padding: 10 
    },
    title: { 
      fontSize: 18, 
      fontWeight: "bold", 
      marginTop: 10 
    },
    eventCard: { 
      backgroundColor: "#fff", 
      padding: 16, 
      marginVertical: 8,
      borderRadius: 8,
      borderLeftWidth: 6,
      borderLeftColor: "#ccc",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },    
    eventName: { 
      fontSize: 16, 
      fontWeight: "bold" 
    },
  });

  export default styles;