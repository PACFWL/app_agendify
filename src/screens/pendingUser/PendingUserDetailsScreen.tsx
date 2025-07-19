import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from "react-native";
import { RouteProp, useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../routes/Routes";
import { getPendingUserById, deletePendingUser } from "../../api/pendingUser";
import styles from "../../styles/PendingUserDetailsScreenStyles";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getColors } from "../../styles/ThemeColors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type PendingUserDetailsRouteProp = RouteProp<RootStackParamList, "PendingUserDetails">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "PendingUserDetails">;

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

const PendingUserDetailsScreen = () => {
  const route = useRoute<PendingUserDetailsRouteProp>();
  const { userId } = route.params;
  const { theme } = useContext(ThemeContext);
  const colors = getColors(theme);
  const auth = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();

  const [loading, setLoading] = useState(true);
  const [pendingUser, setPendingUser] = useState<any>(null);

 useFocusEffect(
    useCallback(() => {
    const fetchData = async () => {
      try {
        if (auth?.user) {
          const data = await getPendingUserById(auth.user.token, userId);
          setPendingUser(data);
        }
      } catch (error) {
        Alert.alert("Erro", "Erro ao carregar detalhes do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId])
  );


  const handleDelete = async () => {
    if (!auth?.user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      await deletePendingUser(auth.user.token, userId);
      Alert.alert("Sucesso", "Usuário pendente deletado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Erro ao deletar usuário pendente.");
    }
  };

  if (!auth?.user) {
    return (
      <View style={styles.center}>
        <Text>Usuário não autenticado.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text }}>Carregando...</Text>
      </View>
    );
  }

  if (!pendingUser) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.text }}>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>{pendingUser.name}</Text>
<View style={[styles.detailCard, { backgroundColor: colors.card }]}>
  {[
    ["Email", pendingUser.email],
    ["Cargo", roleLabel(pendingUser.role)],
  ].map(([label, value], idx) => (
    <View key={idx} style={styles.detailRow}>
      <Text style={[styles.label, { color: colors.primary }]}>{label}:</Text>
      <Text style={[styles.value, { color: colors.cardText }]}>{value}</Text>
    </View>
  ))}
</View>

      <View style={styles.buttonContainer}>
        {auth.user.role === "MASTER" && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.warningButton]}
              onPress={() => navigation.navigate("PendingUserEditForm", { userId })}
            >
              <Text style={styles.buttonText}>Editar Usuário Pendente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Deletar Usuário Pendente</Text>
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
    </ScrollView>
  );
};

export default PendingUserDetailsScreen;