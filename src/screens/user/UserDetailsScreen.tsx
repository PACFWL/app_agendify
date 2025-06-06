import React, { useEffect, useState, useContext } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserById } from "../../api/user";
import { RootStackParamList } from "../../routes/Routes";

type UserDetailsRouteProp = RouteProp<RootStackParamList, "UserDetails">;

const UserDetailsScreen = () => {
  const route = useRoute<UserDetailsRouteProp>();
  const { userId } = route.params;
  const auth = useContext(AuthContext);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [userId]);

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
    <View style={styles.container}>
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.label}>Email: <Text style={styles.value}>{user.email}</Text></Text>
      <Text style={styles.label}>Função: <Text style={styles.value}>{user.role}</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  label: { fontWeight: "bold", marginTop: 10 },
  value: { fontWeight: "normal" },
});

export default UserDetailsScreen;
