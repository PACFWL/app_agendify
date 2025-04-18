import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  eventItem: {
    padding: 15,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  createButton: {
    marginTop: 16,
    backgroundColor: "#6200ee",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  eventCard: {
    backgroundColor: "#f1f1f1",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default styles;