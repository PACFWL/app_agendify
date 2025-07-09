import React from "react";
import { View, TextInput, Button, Text, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/RegisterScreenStyles"
import { Picker } from "@react-native-picker/picker";
import { useRegisterPending } from "../../hooks/useRegisterPending";

type Props = NativeStackScreenProps<RootStackParamList, "RegisterPending">;

const RegisterPendingScreen = ({ navigation }: Props) => {

const {
  formData,
  errors,
  loading,
  handleChange,
  handleRegister,
  showPassword,
  setShowPassword
} = useRegisterPending(navigation);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro Pendente</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
        placeholder="Digite seu nome"
      />
      {errors.name && <Text style={{ color: "red" }}>{errors.name}</Text>}

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        placeholder="Digite seu email"
        autoCapitalize="none"
      />
      {errors.email && <Text style={{ color: "red" }}>{errors.email}</Text>}

      <Text style={styles.label}>Senha:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
          placeholder="Digite sua senha"
        />
        <Text
          style={styles.toggle}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </Text>
      </View>
      {errors.password && <Text style={{ color: "red" }}>{errors.password}</Text>}

      <Text style={styles.label}>Cargo:</Text>
      <View style={styles.input}>
        <Picker
          selectedValue={formData.role}
          onValueChange={(itemValue) => handleChange("role", itemValue)}
        >
          <Picker.Item label="Selecione o cargo" value="" />
          <Picker.Item label="Usuário" value="USER" />
        </Picker>
      </View>
      {errors.role && <Text style={{ color: "red" }}>{errors.role}</Text>}

      <View style={styles.button}>
        <Button title="Registrar" onPress={handleRegister} disabled={loading} />
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Já tem uma conta? Faça login
      </Text>
    </View>
  );
};

export default RegisterPendingScreen;