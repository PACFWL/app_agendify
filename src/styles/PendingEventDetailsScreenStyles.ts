import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
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
    color: "#1E88E5",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    color: "#000",
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
    marginBottom: 30,
  },
  buttonWrapper: {
    marginBottom: 10,
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
});
