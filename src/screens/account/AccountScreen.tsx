import React, { useContext } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "../../styles/AccountScreenStyles";

const AccountScreen = () => {
  const auth = useContext(AuthContext);

  const handleSignOut = async () => {
    if (!auth) {
      Alert.alert("Erro", "Erro ao sair. Tente novamente.");
      return;
    }

    await auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Conta</Text>
      <Text style={styles.item}>Função: {auth?.user?.role}</Text>

      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Perfil", "Funcionalidade em construção.")}>
        <Text style={styles.buttonText}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Configurações", "Funcionalidade em construção.")}>
        <Text style={styles.buttonText}>Configurações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;
