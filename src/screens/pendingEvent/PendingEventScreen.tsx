import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, FlatList, Button, ActivityIndicator, Alert } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllEvents } from "../../api/event";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../../styles/EventScreenStyles";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "../../routes/BottomTabs";
import { CompositeScreenProps } from "@react-navigation/native";

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, "PendingsEvents">,
  NativeStackScreenProps<RootStackParamList>
>;

type Event = {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  theme: string;
  targetAudience: string;
  mode: string;
  environment: string;
  organizer: string;
};

const PendingEventScreen = ({ navigation }: Props) => {
  const auth = useContext(AuthContext);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    if (!auth?.user) return;

    try {
      setLoading(true);
      const data = await getAllEvents(auth.user.token);
      setEvents(data);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar eventos.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [auth])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text>{`Data: ${item.day} - ${item.startTime} às ${item.endTime}`}</Text>
            <Text>{`Tema: ${item.theme}`}</Text>
            <Text>{`Organizador: ${item.organizer}`}</Text>
            <Button
              title="Detalhes"
              onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
            />
          </View>
        )}
      />
        <Button
              title="Criar um Evento"
              onPress={() => navigation.navigate("EventForm")}/>
    </View>
  );
};

export default PendingEventScreen;