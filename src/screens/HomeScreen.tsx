import React, { useState, useContext, useCallback } from "react";
import { View, Text, Alert, ScrollView, TouchableOpacity, Switch } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import { RootStackParamList } from "../routes/Routes";
import getHomeScreenStyles from "../styles/HomeScreenStyles";
import { getAllEvents } from "../api/event";
import { ThemeContext } from "../contexts/ThemeContext";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Home">;

type Event = {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  status: string;
  theme: string;
  targetAudience: string;
  mode: string;
  environment: string;
  organizer: string;
 location: { name: string; floor: string };
  priority: string;
};

const formatStatusText = (status: string): string => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/(^\w{1}|\s+\w{1})/g, letter => letter.toUpperCase());
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
  return (
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
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
  
  const { theme, toggleTheme } = useContext(ThemeContext);
  const styles = getHomeScreenStyles(theme);
  const isDark = theme === "dark";

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

  const today = new Date();

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
    const data = new Date(e.day);
    return isSameDay(data, today);
  });

  const eventosDaSemana = events.filter(e => {
    const data = new Date(e.day);
    return data >= startOfWeek && data <= endOfWeek && !isSameDay(data, today);
  });

  const eventosProximaSemana = events.filter(e => {
    const data = new Date(e.day);
    return data >= startOfNextWeek && data <= endOfNextWeek;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View  style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 24, marginRight: 8 }}>
          {isDark ? "🌙" : "☀"}
        </Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
        trackColor={{ false: "#767577", true: "#81b0ff"}}
      />
      </View>

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
