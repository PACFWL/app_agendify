import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
  section: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#1976d2",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    marginBottom: 6,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
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
   labelPicker: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    overflow: 'hidden', 
  },
  picker: {
    color: '#000',
    paddingHorizontal: 10,
    height: 50,
  },
filledInput: {
  borderColor: "#4caf50", 
  backgroundColor: "#e8f5e9", 
},


});

export default styles;
