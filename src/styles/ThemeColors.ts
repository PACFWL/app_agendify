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
    success: "#4caf00",
    filled: "#7cc57e", 
    inputFilledBackground: "#e6f4ea",
    inputErrorBackground: "#fdeaea",
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
    success: "#81c784",
    filled: "#7cc57e",
    inputFilledBackground: "#1a3324",
    inputErrorBackground: "#3b1e1e",
  },
};

export const getColors = (theme: ThemeType) => colors[theme];


