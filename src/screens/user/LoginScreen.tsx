import React, { useState, useContext, useEffect } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/LoginScreenStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;    

const LoginScreen = ({ navigation }: Props) => {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (auth?.user) {
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }
  }, [auth?.user]);

  const handleLogin = async () => {
    if (!auth) return;

    try {
      await auth.signIn(email, password);
    } catch (error) {
      Alert.alert("Erro", "Erro ao fazer login!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
      />

      <Text style={styles.label}>Senha:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholder="Digite sua senha"
        />
        <Text
          style={styles.toggle}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </Text>
      </View>

      <View style={styles.button}>
        <Button title="Login" onPress={handleLogin} color="#007BFF" />
      </View>
      <Text style={styles.link} onPress={() => navigation.navigate("RegisterPending")}>
        Solicitar Cadastro
      </Text>
    </View>
  );
};

export default LoginScreen;