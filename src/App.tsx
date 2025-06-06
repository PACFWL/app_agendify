import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { AuthProvider } from "./contexts/AuthContext";
import Routes from "./routes/Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeContext } from "./contexts/ThemeContext";

function App(): React.JSX.Element {
 const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <AuthProvider>
       <ThemeProvider>
      <NavigationContainer>
  <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
        <Routes />
      </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;