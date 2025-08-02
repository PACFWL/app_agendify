import React, { useContext, useState } from "react";
import {View,TextInput,Text,Alert,ScrollView,TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../routes/Routes";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { getColors } from "../../../styles/ThemeColors.styles";
import createRegisterScreenStyles from "./RegisterScreen.styles";
import { useRegister } from "../../../hooks/register/useRegister";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen = ({ navigation }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const { theme } = useContext(ThemeContext);
  const colors = getColors(theme);
  const styles = createRegisterScreenStyles(theme);

  const {
    formData,
    errors,
    loading,
    handleChange,
    handleRegister,
  } = useRegister(navigation);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={[styles.title, { color: colors.primary }]}>Novo Usuário</Text>

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
      <View
        style={[
          styles.passwordContainer,
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
          },
        ]}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder="Digite a senha"
          placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <Text
          style={[styles.toggle, { color: colors.accent }]}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </Text>
      </View>
      {errors.password && <Text style={{ color: colors.error, marginBottom: 12 }}>{errors.password}</Text>}
      {!errors.password && formData.password && <Text style={{ color: colors.success, marginBottom: 12 }}>✓ Senha válida</Text>}

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
      {formData.role && !errors.role && (
        <Text style={{ color: colors.success, marginBottom: 12 }}>
          ✓ Cargo selecionado
        </Text>
      )}
      {errors.role && (
        <Text style={{ color: colors.error, marginBottom: 12 }}>
          {errors.role}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.addButton, { opacity: loading ? 0.6 : 1 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.addButtonText}>Registrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;