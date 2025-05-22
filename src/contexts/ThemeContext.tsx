import React, { createContext, useState, ReactNode, useEffect } from "react";
import { Appearance } from "react-native";

export type ThemeType = "light" | "dark";

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
  setLightTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setLightTheme: () => {},
});


export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<ThemeType>(colorScheme === "dark" ? "dark" : "light");

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const setLightTheme = () => {
    setTheme("light");
  };

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    });

    return () => listener.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setLightTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
