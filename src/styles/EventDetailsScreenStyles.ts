import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E88E5",
    marginBottom: 16,
    textAlign: "center",
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
  detail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 12,      
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
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

export default styles;
