import React, { createContext, useState, useEffect, ReactNode } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../api/auth";


type UserType = {
  id: string;
  token: string;
  role: "MASTER" | "REQUESTER" | "USER";
};

type AuthContextType = {
  user: UserType | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");
      console.log("🔹 Token armazenado:", token);
      console.log("🔹 Role armazenada:", role);
      const id = await AsyncStorage.getItem("id");
      if (token && role && id && ["MASTER", "REQUESTER", "USER"].includes(role)) {
        setUser({ id, token, role: role as "MASTER" | "REQUESTER" | "USER" });
      }            
      setLoading(false);
    };
    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    const data = await login(email, password); 
    console.log("🔹 Dados retornados do backend:", data);
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("role", data.role);
    setUser(data);
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(["token", "role"]);
    setUser(null);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
