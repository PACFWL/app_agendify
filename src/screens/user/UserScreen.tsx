import React, { useEffect, useState, useContext, useCallback } from "react";
import {View,Text,FlatList,TouchableOpacity,Alert,ActivityIndicator,ScrollView} from "react-native";
import styles from "../../styles/UserScreenStyles";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllUsers } from "../../api/user";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getColors } from "../../styles/ThemeColors";
import { ThemeContext } from "../../contexts/ThemeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";

type User = {
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
  colors,
}: {
  user: User;
  colors: ReturnType<typeof getColors>;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("UserDetails", { userId: user.id })}
      style={[styles.card, { backgroundColor: colors.card }]}
    >
      <Text style={[styles.name, { color: colors.cardTitle }]}>{user.name}</Text>
      <Text style={[styles.email, { color: colors.text }]}>Email: {user.email}</Text>
      <Text style={[styles.role, { color: colors.text }]}>Cargo: {roleLabel(user.role)}</Text>
    </TouchableOpacity>
  );
};

const UserScreen = () => {
  const auth = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const colors = getColors(theme);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"MASTER" | "REQUESTER" | "USER">("USER");

  if (!auth || !auth.user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Usuário não autenticado.</Text>
      </View>
    );
  }

  const { user } = auth;

  const fetchUsers = async () => {
    try {
      const result = await getAllUsers(user.token);
      setUsers(result);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar usuários.");
    }
  };

  const load = async () => {
    setLoading(true);
    await fetchUsers();
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const filteredUsers = users.filter((u) => u.role === activeTab);

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
      <Text style={[styles.title, { color: colors.primary }]}>Usuários</Text>

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
        renderItem={({ item }) => <UserCard user={item} colors={colors} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {(user.role === "MASTER") && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserScreen;