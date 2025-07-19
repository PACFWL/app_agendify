import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { RouteProp, useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getColors } from "../../styles/ThemeColors";
import { getUserById, deleteUser } from "../../api/user";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/UserDetailsScreenStyles";

type UserDetailsRouteProp = RouteProp<RootStackParamList, "UserDetails">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "UserDetails">;

const roleLabel = (role: string) => {
  switch (role) {
    case "MASTER":
      return "Administrador";
    case "REQUESTER":
      return "Solicitante";
    case "USER":
      return "Usuário";
    default:
      return role;
  }
};

const UserDetailsScreen = () => {
  const route = useRoute<UserDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { userId } = route.params;
  const auth = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const themeColors = getColors(theme);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

   useFocusEffect(
     useCallback(() => {
    const fetchUser = async () => {
      try {
        if (auth?.user) {
          const data = await getUserById(auth.user.token, userId);
          setUser(data);
        }
      } catch (error) {
        Alert.alert("Erro", "Erro ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId])
  );

  const handleDelete = async () => {
     if (!auth?.user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
    try {
      await deleteUser(auth!.user.token, userId);
      Alert.alert("Sucesso", "Usuário deletado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Erro ao deletar o usuário.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.primary }]}>{user.name}</Text>
 <View style={[styles.detailCard, { backgroundColor: themeColors.card }]}>
  {[
    ["Email", user.email],
    ["Função", roleLabel(user.role)],
  ].map(([label, value], idx) => (
    <View key={idx} style={styles.detailRow}>
      <Text style={[styles.label, { color: themeColors.primary }]}>{label}:</Text>
      <Text style={[styles.value, { color: themeColors.cardText }]}>{value}</Text>
    </View>
  ))}
</View>

      <View style={styles.buttonContainer}>
        {auth?.user?.role === "MASTER" && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.warningButton]}
              onPress={() => navigation.navigate("UserEditForm", { userId })}
            >
              <Text style={styles.buttonText}>Editar Usuário</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Deletar Usuário</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserDetailsScreen;