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

  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 30,
  },
  detailRow: {
  marginBottom: 12,
  borderBottomWidth: 0.6,
  borderBottomColor: "#ccc",
  paddingBottom: 8,
  },
    label: {
      fontWeight: "600",
      fontSize: 14,
      marginBottom: 2,
    },

  value: {
    fontSize: 14,
    lineHeight: 18,
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: "#1976d2",
  },

  warningButton: {
    backgroundColor: "#FFA726",
  },

  dangerButton: {
    backgroundColor: "#E53935",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

});