import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40
  },
  innerContainer: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  value: {
    color: "#444",
    marginBottom: 8,
  },
  requesterLink: {
    backgroundColor: "#f2f2f2",
    color: "#6200ee",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
    fontWeight: "bold",
    elevation: 1,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 10,
  },
  buttonWrapper: {
    marginBottom: 10,
  },
  
});
