import React, { useState, useContext, useCallback } from "react";
import {View,Text,FlatList,ActivityIndicator,Alert,TouchableOpacity} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllEvents } from "../../api/event";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "../../styles/EventScreenStyles";

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

    const EventCard = ({ event }: { event: Event }) => {
      const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
            style={styles.eventCard}
          >
            <Text style={styles.eventDate}>{event.day}</Text>
            <Text style={styles.eventName}>{event.name}</Text>
            <View style={styles.eventInfoRow}>
              <Text style={styles.eventTime}>{`${event.startTime} - ${event.endTime}`}</Text>
              <Text style={styles.eventTheme}>Tema: {event.theme}</Text>
            </View>
            <Text style={styles.eventOrganizer}>Organizador: {event.organizer}</Text>
          </TouchableOpacity>
        );
      };

const Loading = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#1976d2" />
    <Text>Carregando eventos...</Text>
  </View>
);

const EventScreen = () => {
  const auth = useContext(AuthContext);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda de Eventos</Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {auth?.user?.role === "MASTER" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("EventForm")}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EventScreen;
