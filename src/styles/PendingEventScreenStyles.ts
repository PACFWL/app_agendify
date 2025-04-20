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
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    padding: 10,
  },
  tabButtonLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  tabButtonRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#6200ee",
  },
  tabButtonInactive: {
    backgroundColor: "#e0e0e0",
  },
  tabButtonTextActive: {
    color: "#fff",
    textAlign: "center",
  },
  tabButtonTextInactive: {
    color: "#000",
    textAlign: "center",
  },
  myEventsHeader: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  myEventsHeaderText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 5,
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
