import React, { useState, useContext, useEffect } from "react";
import {View,TextInput,Button,Text,Alert,TouchableOpacity} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getColors } from "../../styles/ThemeColors";
import createStyles from "../../styles/LoginScreenStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen = ({ navigation }: Props) => {
  const auth = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const colors = getColors(theme);
  const styles = createStyles(theme);

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
        placeholderTextColor={colors.noEventText}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholder="Digite sua senha"
          placeholderTextColor={colors.noEventText}
        />
        <Text style={styles.toggle} onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? "Ocultar" : "Mostrar"}
        </Text>
      </View>

      <View style={styles.button}>
        <Button
          title="Login"
          onPress={handleLogin}
          color={colors.primary}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("RegisterPending")}>
        <Text style={styles.link}>Solicitar Cadastro</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;