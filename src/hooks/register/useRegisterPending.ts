import { useState } from "react";
import { Alert } from "react-native";
import { registerPending } from "../../api/pendingUser";

export const useRegisterPending = (navigation: any) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (field === "name") {
        if (!value.trim()) {
          newErrors.name = "Nome é obrigatório.";
        } else if (!/[a-zA-Z]/.test(value)) {
          newErrors.name = "O nome deve conter letras.";
        } else {
          delete newErrors.name;
        }
      }

      if (field === "email") {
        if (!value.trim()) {
          newErrors.email = "Email é obrigatório.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = "Formato de email inválido.";
        } else {
          delete newErrors.email;
        }
      }

      if (field === "password") {
        if (!value.trim()) {
          newErrors.password = "Senha é obrigatória.";
        } else if (value.length < 6) {
          newErrors.password = "Senha deve ter pelo menos 6 caracteres.";
        } else if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])/.test(value)) {
          newErrors.password = "Senha deve conter letra, número e caractere especial.";
        } else {
          delete newErrors.password;
        }
      }

      if (field === "role") {
        if (!value.trim()) {
          newErrors.role = "Cargo é obrigatório.";
        } else {
          delete newErrors.role;
        }
      }

      return newErrors;
    });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório.";
    } else if (!/[a-zA-Z]/.test(formData.name)) {
      newErrors.name = "O nome deve conter letras.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de email inválido.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Senha é obrigatória.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres.";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])/.test(formData.password)) {
      newErrors.password = "Senha deve conter letra, número e caractere especial.";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Cargo é obrigatório.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await registerPending(formData.name, formData.email, formData.password, formData.role);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", "Falha ao registrar usuário pendente.");
    } finally {
      setLoading(false);
    }
  };

return {
  formData,
  errors,
  loading,
  handleChange,
  handleRegister
};
};