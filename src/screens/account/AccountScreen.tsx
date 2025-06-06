import React, { useContext } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getColors } from "../../styles/ThemeColors";

const AccountScreen = () => {
  const auth = useContext(AuthContext);
   const { theme, setLightTheme } = useContext(ThemeContext);
  const colors = getColors(theme);

  const handleSignOut = async () => {
    if (!auth) {
      Alert.alert("Erro", "Erro ao sair. Tente novamente.");
      return;
    }

    await auth.signOut();

    setLightTheme(); 
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      <Text style={{
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 24,
        color: colors.primary,
        textAlign: "center"
      }}>Minha Conta</Text>
      <Text style={{
        fontSize: 16,
        marginBottom: 20,
        color: colors.cardTitle,
        textAlign: "center"
      }}>Função: {auth?.user?.role}</Text>

      <TouchableOpacity style={{
          backgroundColor: colors.primary,
          borderRadius: 12,
          marginVertical: 8,
          paddingVertical: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }} onPress={() => Alert.alert("Perfil", "Funcionalidade em construção.")}>
        <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600", textAlign: "center" }}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{
          backgroundColor: colors.primary,
          borderRadius: 12,
          marginVertical: 8,
          paddingVertical: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }} onPress={() => Alert.alert("Configurações", "Funcionalidade em construção.")}>
        <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600", textAlign: "center" }}>Configurações</Text>
      </TouchableOpacity>

      <TouchableOpacity   style={{
          backgroundColor: "#e53935", 
          borderRadius: 12,
          marginVertical: 8,
          paddingVertical: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }} onPress={handleSignOut}>
        <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600", textAlign: "center" }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;
