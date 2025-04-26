import React, { useState, useContext, useCallback } from "react";
import { View, Text, Alert, ScrollView, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; 
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import { RootStackParamList } from "../routes/Routes"; 
import styles from "../styles/HomeScreenStyles";
import { getAllEvents } from "../api/event";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Home">;

type Event = {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  status: string;
};

const formatStatusText = (status: string): string => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/(^\w{1}|\s+\w{1})/g, letter => letter.toUpperCase());
};

const ajustarParaSaoPaulo = (data: Date): Date => {
  const ajustada = new Date(data);
  ajustada.setHours(ajustada.getHours() - 3);
  return ajustada;
};
const getStatusColor = (status: string): string => {
  switch (status) {
    case "PLANEJADO":
      return "#2196f3";
    case "EM_ANDAMENTO":
      return "#4caf50";
    case "FINALIZADO":
      return "#9e9e9e";
    case "EM_ANALISE":
      return "#ff9800";
    case "EM_PAUSA":
      return "#f44336";
    default:
      return "#607d8b";
  }
};

const statusPriority: Record<string, number> = {
  "EM_ANDAMENTO": 1,
  "EM_ANALISE": 2,
  "EM_PAUSA": 3,
  "PLANEJADO": 4,
  "FINALIZADO": 5
};

const isSameDay = (dateA: Date, dateB: Date): boolean => {
  const ajustadaA = ajustarParaSaoPaulo(dateA);
  const ajustadaB = ajustarParaSaoPaulo(dateB);
  return (
    ajustadaA.getDate() === ajustadaB.getDate() &&
    ajustadaA.getMonth() === ajustadaB.getMonth() &&
    ajustadaA.getFullYear() === ajustadaB.getFullYear()
  );
};


const ordenarEventos = (eventos: Event[]): Event[] => {
  return eventos.sort((a, b) => {
    const priorityA = statusPriority[a.status] ?? 999;
    const priorityB = statusPriority[b.status] ?? 999;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const dateA = new Date(a.day);
    const dateB = new Date(b.day);

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }

    const startA = new Date(a.startTime);
    const startB = new Date(b.startTime);

    return startA.getTime() - startB.getTime();
  });
};

const HomeScreen = () => {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<NavigationProps>(); 
  const [events, setEvents] = useState<Event[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        if (!auth?.user) return;

        try {
          const data = await getAllEvents(auth.user.token);
          const eventosOrdenados = ordenarEventos(data);
          setEvents(eventosOrdenados);
        } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar os eventos.");
        }
      };

      fetchEvents();
    }, [auth])
  );

  const today = ajustarParaSaoPaulo(new Date());

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfNextWeek = new Date(endOfWeek);
  startOfNextWeek.setDate(endOfWeek.getDate() + 1);
  startOfNextWeek.setHours(0, 0, 0, 0);

  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
  endOfNextWeek.setHours(23, 59, 59, 999);

  const eventosDoDia = events.filter(e => {
    const data = ajustarParaSaoPaulo(new Date(e.day));
    return isSameDay(data, today);
  });

  const eventosDaSemana = events.filter(e => {
    const data = ajustarParaSaoPaulo(new Date(e.day));
    return data >= startOfWeek && data <= endOfWeek && !isSameDay(data, today);
  });

  const eventosProximaSemana = events.filter(e => {
    const data = ajustarParaSaoPaulo(new Date(e.day));
    return data >= startOfNextWeek && data <= endOfNextWeek;
  });


  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.welcome}>Bem-vindo, {auth?.user?.name}!</Text>

      <Text style={styles.sectionTitle}>📅 Eventos de Hoje</Text>
      {eventosDoDia.length === 0 ? (
        <Text style={styles.noEventText}>Nenhum evento hoje.</Text>
      ) : (
        eventosDoDia.map(event => (
          <TouchableOpacity
            key={event.id}
            onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
          >
            <View style={[styles.card, { borderLeftColor: getStatusColor(event.status) }]}>
              <Text style={styles.cardTitle}>{event.name}</Text>
              <Text style={styles.cardText}>Horário: {event.startTime} - {event.endTime}</Text>
              <Text style={[styles.statusTag, { backgroundColor: getStatusColor(event.status) }]}>
                {formatStatusText(event.status)}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.sectionTitle}>🗓️ Eventos da Semana</Text>
      {eventosDaSemana.length === 0 ? (
        <Text style={styles.noEventText}>Nenhum evento esta semana.</Text>
      ) : (
        eventosDaSemana.map(event => (
          <TouchableOpacity
            key={event.id}
            onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
          >
            <View style={[styles.card, { borderLeftColor: getStatusColor(event.status) }]}>
              <Text style={styles.cardTitle}>{event.name}</Text>
              <Text style={styles.cardText}>Data: {new Date(event.day).toLocaleDateString("pt-BR")}</Text>
              <Text style={[styles.statusTag, { backgroundColor: getStatusColor(event.status) }]}>
                {formatStatusText(event.status)}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.sectionTitle}>📆 Eventos da Semana que vem</Text>
      {eventosProximaSemana.length === 0 ? (
        <Text style={styles.noEventText}>Nenhum evento na semana que vem.</Text>
      ) : (
        eventosProximaSemana.map(event => (
          <TouchableOpacity
            key={event.id}
            onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
          >
            <View style={[styles.card, { borderLeftColor: getStatusColor(event.status) }]}>
              <Text style={styles.cardTitle}>{event.name}</Text>
              <Text style={styles.cardText}>Data: {new Date(event.day).toLocaleDateString("pt-BR")}</Text>
              <Text style={[styles.statusTag, { backgroundColor: getStatusColor(event.status) }]}>
                {formatStatusText(event.status)}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default HomeScreen;