import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  detail: {
    fontSize: 14,
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    fontWeight: "normal",
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 30,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#1E88E5",
  },
  warningButton: {
    backgroundColor: "#FFA726",
  },
  dangerButton: {
    backgroundColor: "#E53935",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  detailRow: {
  marginBottom: 12,
  borderBottomWidth: 0.6,
  borderBottomColor: "#ccc",
  paddingBottom: 8,
  },
});