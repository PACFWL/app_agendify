import { StyleSheet } from "react-native";

const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    marginBottom: 16,
    color: '#000',
  },
  button: {
    marginTop: 16,
  },
  link: {
    marginTop: 24,
    textAlign: "center",
    color: "#007BFF",
  },
  passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderColor: "#CCC",
  borderWidth: 1,
  borderRadius: 8,
  backgroundColor: "#FFF",
  marginBottom: 16,
  paddingHorizontal: 12,
},
passwordInput: {
  flex: 1,
  height: 48,
  color: "#000",
},
toggle: {
  marginLeft: 12,
  color: "#007BFF",
  fontWeight: "500",
},
});

export default LoginScreenStyles;