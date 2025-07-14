import React, { useContext, useState } from "react";
import {View,TextInput,Button,Text,Alert,ActivityIndicator,TouchableOpacity} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import createStyles from "../../styles/RegisterPendingScreenStyles";
import { Picker } from "@react-native-picker/picker";
import { useRegisterPending } from "../../hooks/useRegisterPending";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getColors } from "../../styles/ThemeColors";

type Props = NativeStackScreenProps<RootStackParamList, "RegisterPending">;

const RegisterPendingScreen = ({ navigation }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const { theme } = useContext(ThemeContext);
  const colors = getColors(theme);
  const styles = createStyles(theme);

  const {
    formData,
    errors,
    loading,
    handleChange,
    handleRegister,
  } = useRegisterPending(navigation);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro Pendente</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={[styles.input, 
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
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
        placeholder="Digite seu nome"
        placeholderTextColor={colors.noEventText}
      />
      {errors.name && <Text style={{ color: colors.error }}>{errors.name}</Text>}
      {!errors.name && formData.name && <Text style={{ color: colors.success, marginBottom: 12 }}>✓ Nome válido</Text>}
      
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={[styles.input,
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
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        placeholder="Digite seu email"
        placeholderTextColor={colors.noEventText}
        autoCapitalize="none"
      />
      {errors.email && <Text style={{ color: colors.error }}>{errors.email}</Text>}
      {!errors.email && formData.email && <Text style={{ color: colors.success, marginBottom: 12 }}>✓ Email válido</Text>}
      
      <Text style={styles.label}>Senha:</Text>
      <View style={[styles.passwordContainer,
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
      ]}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
          placeholder="Digite sua senha"
          placeholderTextColor={colors.noEventText}
        />
        <Text style={styles.toggle} onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? "Ocultar" : "Mostrar"}
        </Text>
      </View>
      {errors.password && <Text style={{ color: colors.error }}>{errors.password}</Text>}
      {!errors.password && formData.password && <Text style={{ color: colors.success, marginBottom: 12 }}>✓ Senha válida</Text>}

      <Text style={styles.label}>Cargo:</Text>
      <View style={[styles.pickerContainer,
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
      ]}>
        <Picker
          selectedValue={formData.role}
          onValueChange={(itemValue) => handleChange("role", itemValue)}
          style={{ color: colors.text }}
          dropdownIconColor={colors.text}
        >
          <Picker.Item label="Selecione o cargo" value="" color={colors.text} />
          <Picker.Item label="Usuário" value="USER" color={colors.text} />
        </Picker>
      </View>
      {errors.role && <Text style={{ color: colors.error }}>{errors.role}</Text>}
      {formData.role && !errors.role && <Text style={{ color: colors.success, marginBottom: 12 }}>✓ Cargo selecionado</Text>}

      <View style={styles.button}>
        <Button title="Registrar" onPress={handleRegister} color={colors.primary} disabled={loading} />
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 16 }} color={colors.primary} />}

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterPendingScreen;