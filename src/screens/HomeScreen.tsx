import React, { useContext } from "react";
import { View, Text, Button, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; 
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import { RootStackParamList } from "../routes/Routes"; 
import styles from "../styles/HomeScreenStyles";


type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Home">;

const HomeScreen = () => {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<NavigationProps>(); 

  const handleSignOut = async () => {
    if (!auth) {
      Alert.alert("Erro", "Erro ao sair. Tente novamente.");
      return;
    }

    await auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo à Home!</Text>
    </View>
  );
};

export default HomeScreen;