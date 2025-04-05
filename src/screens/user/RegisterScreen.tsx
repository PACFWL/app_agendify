import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import { register } from "../../api/auth"; 
import styles from "../../styles/RegisterScreenStyles"

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async () => {
    try {
      await register(name, email, password, role); 
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", "Falha ao registrar usuário.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      
      <Text style={styles.label}>Nome:</Text>
      <TextInput
      style={styles.input} 
      value={name} 
      onChangeText={setName}
      placeholder="Digite seu nome"
      />
      
      <Text style={styles.label}>Email:</Text>
      <TextInput 
      style={styles.input} 
      value={email} 
      onChangeText={setEmail} 
      placeholder="Digite seu email"
      />
      <Text style={styles.label}>Senha:</Text>
      <TextInput 
      style={styles.input}
      secureTextEntry value={password} 
      onChangeText={setPassword} 
      placeholder="Digite sua senha"
      />
      <Text style={styles.label}>Role:</Text>
      <TextInput 
      style={styles.input}
      value={role} 
      onChangeText={setRole} 
      placeholder="DIgite seu role"
      />
      <View style={styles.button}>
      <Button title="Registrar" onPress={handleRegister} />
      </View>
      <Text  style={styles.link} onPress={() => navigation.navigate("Login")}>Já tem uma conta? Faça login</Text>
    </View>
  );
};

export default RegisterScreen;