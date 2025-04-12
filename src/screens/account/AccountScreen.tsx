import React, { useContext } from "react";
import { View, Text, Button, Alert } from "react-native";
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
      <View style={styles.button}>
        <Button title="Perfil" onPress={() => Alert.alert("Perfil", "Funcionalidade em construção.")} />
      </View>
      <View style={styles.button}>
        <Button title="Configurações" onPress={() => Alert.alert("Configurações", "Funcionalidade em construção.")} />
      </View>
      <View style={styles.button}>
        <Button title="Sair" onPress={handleSignOut} color="red" />
      </View>
    </View>
  );
};

export default AccountScreen;
