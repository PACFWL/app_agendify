import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#6200ee",
    textAlign: "center",
  },
  eventCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
});
