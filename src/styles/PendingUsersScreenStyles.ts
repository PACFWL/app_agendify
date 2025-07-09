import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 10,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
  },
  approveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  rejectButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
