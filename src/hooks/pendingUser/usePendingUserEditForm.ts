import { useState, useEffect, useContext } from "react";
import { Alert } from "react-native";
import { getPendingUserById, updatePendingUser } from "../../api/pendingUser";
import { AuthContext } from "../../contexts/AuthContext";

export const usePendingUserEditForm = (userId: string, navigation: any) => {
  const auth = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (auth?.user) {
          const data = await getPendingUserById(auth.user.token, userId);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            password: "●●●●●●●●●",
            role: data.role,
          });
        }
      } catch (error) {
        Alert.alert("Erro", "Erro ao carregar usuário pendente.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

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
         if (value && value.trim().length < 6) {
          newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
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

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Cargo é obrigatório.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      if (auth?.user) {


        const passwordIsFake = formData.password === "●●●●●●●●●";

        const dataToSend = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          ...(formData.password.trim() !== "" && !passwordIsFake && { password: formData.password }),
        };

        await updatePendingUser(auth.user.token, userId, dataToSend);
        Alert.alert("Sucesso", "Usuário pendente atualizado!");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao atualizar usuário pendente.");
    }
  };

  return {
    formData,
    setFormData,
    errors,
    handleUpdate,
    loading,
    handleChange,
  };
};