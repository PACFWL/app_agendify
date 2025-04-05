import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { AuthProvider } from "./contexts/AuthContext";
import Routes from "./routes/Routes";

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;