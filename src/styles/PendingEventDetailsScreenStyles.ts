import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
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
});
