import { StyleSheet } from "react-native";

const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingTop: 32,
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    color: "#212529",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 6,
    borderLeftColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#343a40",
  },
  cardText: {
    fontSize: 14,
    color: "#495057",
  },
  button: {
    marginTop: 16,
  },
  noEventText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    marginLeft: 10,
    marginBottom: 10,
  },  
  statusTag: {
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontWeight: "bold",
    marginTop: 4,
    color: "#fff",
  },
});

export default HomeScreenStyles;