import { StyleSheet } from "react-native";

const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 20,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    color: "#1976d2",
  },
  card: {
    backgroundColor: "#ffffff",
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
    color: "#37474f",
  },
  cardText: {
    fontSize: 14,
    color: "#555",
  },
  statusTag: {
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontWeight: "bold",
    marginTop: 4,
    color: "#fff",
    fontSize: 12,
  },
  noEventText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    marginLeft: 10,
    marginBottom: 10,
  },
});

export default HomeScreenStyles;
