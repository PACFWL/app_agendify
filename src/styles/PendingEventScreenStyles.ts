import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1976d2",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eventCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  eventDate: {
    fontSize: 14,
    color: "#0288d1",
    fontWeight: "600",
    marginBottom: 4,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#37474f",
  },
  eventInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  eventTime: {
    fontSize: 14,
    color: "#555",
  },
  eventTheme: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  eventOrganizer: {
    fontSize: 13,
    color: "#666",
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
    backgroundColor: "#1976d2",
  },
  tabButtonInactive: {
    backgroundColor: "#e0e0e0",
  },
  tabButtonTextActive: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  tabButtonTextInactive: {
    color: "#000",
    textAlign: "center",
  },
  myEventsHeader: {
    backgroundColor: "#1976d2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  myEventsHeaderText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#1976d2",
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
  tagsRow: {
  flexDirection: "row",
  marginTop: 6,
  gap: 8,
  flexWrap: "wrap",
},

tag: {
  color: "white",
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  fontSize: 12,
  overflow: "hidden",
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
});
