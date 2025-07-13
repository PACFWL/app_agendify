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
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#6200ee",
  },
  tabButtonInactive: {
    backgroundColor: "#e0e0e0",
  },
  tabButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabButtonTextInactive: {
    color: "#333",
  },
  highlightBorder: {
  borderWidth: 2,
  borderColor: "#6200ee", 
},
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#6200ee",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  fabIcon: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 28,
  },
});


/*
fab: {
  position: "absolute",
  right: 20,
  bottom: 20,
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#6200ee",
  justifyContent: "center",
  alignItems: "center",
  elevation: 5,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
},
fabIcon: {
  color: "#fff",
  fontSize: 28,
  fontWeight: "bold",
},
*/