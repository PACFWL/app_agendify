import React, { useContext } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../routes/Routes";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { getColors } from "../../../styles/ThemeColors.styles";
import styles from "./UserEditFormScreen.styles";
import { useUserEditForm } from "../../../hooks/user/useUserEditForm";

type Props = NativeStackScreenProps<RootStackParamList, "UserEditForm">;

const UserEditFormScreen = ({ route, navigation }: Props) => {
  const { userId } = route.params;
  const { theme } = useContext(ThemeContext);
  const colors = getColors(theme);

  const {
    formData,
    setFormData,
    errors,
    loading,
    handleUpdate,
    handleChange,
  } = useUserEditForm(userId, navigation);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={[styles.title, { color: colors.primary }]}>Editar Usuário</Text>

      <Text style={[styles.label, { color: colors.text }]}>Nome:</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: errors.name
              ? colors.inputErrorBackground
              : formData.name.trim()
              ? colors.inputFilledBackground
              : colors.card,
            borderColor: errors.name
              ? colors.error
              : formData.name.trim()
              ? colors.success
              : colors.accent,
            color: colors.text,
          },
        ]}
        placeholder="Nome"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      {errors.name && <Text style={{ color: colors.error, marginBottom: 12 }}>{errors.name}</Text>}
      {!errors.name && formData.name.trim() !== "" && (
        <Text style={{ color: colors.success, marginBottom: 12 }}>✓ Nome válido</Text>
      )}

      <Text style={[styles.label, { color: colors.text }]}>Email:</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: errors.email
              ? colors.inputErrorBackground
              : formData.email.trim()
              ? colors.inputFilledBackground
              : colors.card,
            borderColor: errors.email
              ? colors.error
              : formData.email.trim()
              ? colors.success
              : colors.accent,
            color: colors.text,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      {errors.email && <Text style={{ color: colors.error, marginBottom: 12 }}>{errors.email}</Text>}
      {!errors.email && formData.email.trim() !== "" && (
        <Text style={{ color: colors.success, marginBottom: 12 }}>✓ Email válido</Text>
      )}

      <Text style={[styles.label, { color: colors.text }]}>Senha:</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: errors.password
              ? colors.inputErrorBackground
              : formData.password.trim()
              ? colors.inputFilledBackground
              : colors.card,
            borderColor: errors.password
              ? colors.error
              : formData.password.trim()
              ? colors.success
              : colors.accent,
            color: colors.text,
          },
        ]}
        placeholder="Senha"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
        secureTextEntry={false}
        value={formData.password}
        onFocus={() => {
          if (formData.password === "●●●●●●●●●") {
            setFormData((prev) => ({ ...prev, password: "" }));
          }
        }}
        onChangeText={(text) => handleChange("password", text)}
      />
      {errors.password && <Text style={{ color: colors.error, marginBottom: 12 }}>{errors.password}</Text>}
      {!errors.password && formData.password.trim() !== "" && (
        <Text style={{ color: colors.success, marginBottom: 12 }}>✓ Senha válida</Text>
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
        <Text style={{ color: colors.success, marginBottom: 12 }}>✓ Cargo selecionado</Text>
      )}
      {errors.role && <Text style={{ color: colors.error, marginBottom: 12 }}>{errors.role}</Text>}

      <TouchableOpacity style={styles.addButton} onPress={handleUpdate}>
        <Text style={styles.addButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserEditFormScreen;