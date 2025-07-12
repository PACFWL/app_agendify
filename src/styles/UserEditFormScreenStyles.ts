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
    textAlign: "center",
    color: "#1976d2",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#37474f",
  },
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    overflow: "hidden",
  },
  addButton: {
    backgroundColor: "#1976d2",
    marginBottom: 10,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
});