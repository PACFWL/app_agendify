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
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24 }}>
      <Text style={{
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 16,
        color: colors.primary,
        textAlign: "center"
      }}>
        Minha Conta
      </Text>

      <View style={{
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 24,
      }}>
        <Text style={{
          fontSize: 16,
          color: colors.cardTitle,
          marginBottom: 8,
          textAlign: "center",
        }}>
          <Text style={{ fontWeight: "600" }}>Nome: </Text>
          {auth?.user?.name || "N/A"}
        </Text>
        <Text style={{
          fontSize: 16,
          color: colors.cardTitle,
          textAlign: "center",
        }}>
          <Text style={{ fontWeight: "600" }}>Função: </Text>
          {auth?.user?.role || "N/A"}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        style={{
          backgroundColor: colors.error,
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 32,
          alignSelf: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text style={{
          color: colors.buttonText,
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center"
        }}>
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;


/**
     <Text style={{
          fontSize: 16,
          color: colors.cardTitle,
          marginBottom: 8,
          textAlign: "center",
        }}>
          <Text style={{ fontWeight: "600" }}>Email: </Text>
          {auth?.user?.email || "N/A"}
        </Text>
        */

