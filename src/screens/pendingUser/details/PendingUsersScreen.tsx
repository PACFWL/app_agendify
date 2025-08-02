import React, { useEffect, useState, useContext, useCallback } from "react";
import {View,Text,FlatList,TouchableOpacity,Alert,ActivityIndicator} from "react-native";
import styles from "./PendingUsersScreen.styles";
import { AuthContext } from "../../../contexts/AuthContext";
import {getAllPendingUsers,approvePendingUser,rejectPendingUser} from "../../../api/pendingUser";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getColors } from "../../../styles/ThemeColors.styles";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../routes/Routes";

type PendingUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

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

const UserCard = ({
  user,
  token,
  onAction,
  colors,
}: {
  user: PendingUser;
  token: string;
  onAction: () => void;
  colors: ReturnType<typeof getColors>;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleApprove = async () => {
    try {
      await approvePendingUser(token, user.id);
      Alert.alert("Sucesso", "Usuário aprovado com sucesso!");
      onAction();
    } catch (error) {
      Alert.alert("Erro", "Erro ao aprovar usuário.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectPendingUser(token, user.id);
      Alert.alert("Sucesso", "Usuário rejeitado com sucesso!");
      onAction();
    } catch (error) {
      Alert.alert("Erro", "Erro ao rejeitar usuário.");
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("PendingUserDetails", { userId: user.id })}
      style={[styles.card, { backgroundColor: colors.card }]}
    >
      <Text style={[styles.name, { color: colors.cardTitle }]}>{user.name}</Text>
      <Text style={[styles.email, { color: colors.text }]}>Email: {user.email}</Text>
      <Text style={[styles.role, { color: colors.text }]}>Cargo: {roleLabel(user.role)}</Text>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
          <Text style={styles.approveButtonText}>Aprovar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
          <Text style={styles.rejectButtonText}>Rejeitar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const PendingUsersScreen = () => {

const navigation =
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const auth = useContext(AuthContext);

  if (!auth || !auth.user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Usuário não autenticado.</Text>
      </View>
    );
  }

  const { user } = auth;
  const { theme } = useContext(ThemeContext);
  const colors = getColors(theme);

  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"USER" | "REQUESTER" | "MASTER">("USER");

  const fetchPendingUsers = async () => {
    try {
      const users = await getAllPendingUsers(user.token);
      setPendingUsers(users);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar usuários pendentes.");
    }
  };

  const load = async () => {
    setLoading(true);
    await fetchPendingUsers();
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

const filteredUsers = pendingUsers.filter((u) => u.role === activeTab);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>
          Carregando usuários...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Usuários Pendentes</Text>

 
      <View style={styles.tabContainer}>
        {["USER", "REQUESTER", "MASTER"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as "USER" | "REQUESTER" | "MASTER")}
            style={[
              styles.tabButton,
              activeTab === tab
                ? styles.tabButtonActive
                : styles.tabButtonInactive,
            ]}
          >
            <Text
              style={
                activeTab === tab
                  ? styles.tabButtonTextActive
                  : styles.tabButtonTextInactive
              }
            >
              {roleLabel(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard user={item} token={user.token} onAction={load} colors={colors} />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={{ color: colors.text, textAlign: "center", marginTop: 20 }}>
            Nenhum usuário pendente encontrado.
          </Text>
        }
      />

      {user.role === "MASTER" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("PendingUserForm")}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PendingUsersScreen;