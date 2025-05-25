import { ThemeType } from "../contexts/ThemeContext";

export const colors = {
  light: {
    background: "#f0f4f8",
    primary: "#1976d2",
    card: "#ffffff",
    cardTitle: "#37474f",
    cardText: "#555",
    statusText: "#fff",
    noEventText: "#888",
    text: "#000000", 
    accent: "#0288d1",
    error: "#d32f2f",
  },
  dark: {
    background: "#121212",
    primary: "#90caf9",
    card: "#1e1e1e",
    cardTitle: "#e0e0e0",
    cardText: "#ccc",
    statusText: "#fff",
    noEventText: "#aaa",
    text: "#ffffff",
    accent: "#4dd0e1", 
     error: "#ef5350",
  },
};

export const getColors = (theme: ThemeType) => colors[theme];
