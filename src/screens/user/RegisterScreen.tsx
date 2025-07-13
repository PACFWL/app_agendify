import React, { useState, useContext } from "react";
import {View,TextInput,Text,Alert,ScrollView,TouchableOpacity} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import { register } from "../../api/auth";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getColors } from "../../styles/ThemeColors";
import createRegisterScreenStyles from "../../styles/RegisterScreenStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen = ({ navigation }: Props) => {
  const { theme } = useContext(ThemeContext);
  const colors = getColors(theme);
  const styles = createRegisterScreenStyles(theme);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" }); 
  };

  const handleRegister = async () => {
    const { name, email, password, role } = formData;

    let hasError = false;
    const newErrors = { name: "", email: "", password: "", role: "" };

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório.";
      hasError = true;
    }
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório.";
      hasError = true;
    }
    if (!password.trim()) {
      newErrors.password = "Senha é obrigatória.";
      hasError = true;
    }
    if (!role) {
      newErrors.role = "Cargo é obrigatório.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(name, email, password, role);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Falha ao registrar usuário.");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={[styles.title, { color: colors.primary }]}>Registro</Text>

      <Text style={[styles.label, { color: colors.text }]}>Nome:</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: errors.name
              ? colors.inputErrorBackground
              : formData.name
              ? colors.inputFilledBackground
              : colors.card,
            borderColor: errors.name
              ? colors.error
              : formData.name
              ? colors.success
              : colors.accent,
            color: colors.text,
          },
        ]}
        placeholder="Digite seu nome"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      {errors.name && (
        <Text style={{ color: colors.error, marginBottom: 12 }}>
          {errors.name}
        </Text>
      )}
      {!errors.name && formData.name && (
        <Text style={{ color: colors.success, marginBottom: 12 }}>
          ✓ Nome válido
        </Text>
      )}

      <Text style={[styles.label, { color: colors.text }]}>Email:</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: errors.email
              ? colors.inputErrorBackground
              : formData.email
              ? colors.inputFilledBackground
              : colors.card,
            borderColor: errors.email
              ? colors.error
              : formData.email
              ? colors.success
              : colors.accent,
            color: colors.text,
          },
        ]}
        placeholder="Digite seu email"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      {errors.email && (
        <Text style={{ color: colors.error, marginBottom: 12 }}>
          {errors.email}
        </Text>
      )}
      {!errors.email && formData.email && (
        <Text style={{ color: colors.success, marginBottom: 12 }}>
          ✓ Email válido
        </Text>
      )}

      <Text style={[styles.label, { color: colors.text }]}>Senha:</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: errors.password
              ? colors.inputErrorBackground
              : formData.password
              ? colors.inputFilledBackground
              : colors.card,
            borderColor: errors.password
              ? colors.error
              : formData.password
              ? colors.success
              : colors.accent,
            color: colors.text,
          },
        ]}
        placeholder="Digite sua senha"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
      />
      {errors.password && (
        <Text style={{ color: colors.error, marginBottom: 12 }}>
          {errors.password}
        </Text>
      )}
      {!errors.password && formData.password && (
        <Text style={{ color: colors.success, marginBottom: 12 }}>
          ✓ Senha válida
        </Text>
      )}

      <Text style={[styles.label, { color: colors.text }]}>Cargo:</Text>
      <View
        style={[
          styles.pickerContainer,
          {
            backgroundColor: errors.role
              ? colors.inputErrorBackground
              : formData.role
              ? colors.inputFilledBackground
              : colors.card,
            borderColor: errors.role
              ? colors.error
              : formData.role
              ? colors.success
              : colors.accent,
          },
        ]}
      >
        <Picker
          selectedValue={formData.role}
          style={{ color: colors.text }}
          dropdownIconColor={colors.text}
          onValueChange={(itemValue) =>
            handleChange("role", itemValue.toString())
          }
        >
          <Picker.Item label="Selecione o cargo" value="" />
          <Picker.Item label="Master" value="MASTER" />
          <Picker.Item label="Solicitante" value="REQUESTER" />
          <Picker.Item label="Usuário" value="USER" />
        </Picker>
      </View>
      {formData.role && (
        <Text style={{ color: colors.success, marginBottom: 12 }}>
          ✓ Cargo selecionado
        </Text>
      )}
      {errors.role && (
        <Text style={{ color: colors.error, marginBottom: 12 }}>
          {errors.role}
        </Text>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleRegister}>
        <Text style={styles.addButtonText}>Registrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;