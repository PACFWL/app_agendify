import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  titleToday: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1976d2",
    textAlign: "center",
    marginBottom: 10,
  },
  titleCalendar: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976d2",
    textAlign: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#37474f",
  },
  eventCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#37474f",
  },
});

export default styles;
