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
    marginBottom: 24,
    color: "#1976d2",
    textAlign: "center",
  },
  item: {
    fontSize: 16,
    marginBottom: 20,
    color: "#37474f",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1976d2",
    borderRadius: 12,
    marginVertical: 8,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  dangerButton: {
    backgroundColor: "#e53935",
    borderRadius: 12,
    marginVertical: 8,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
