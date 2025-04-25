import React, { useState, useContext, useCallback } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; 
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import { RootStackParamList } from "../routes/Routes"; 
import styles from "../styles/HomeScreenStyles";
import { getAllEvents } from "../api/event";
import { TouchableOpacity } from "react-native";

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
  const formatted = status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/(^\w{1}|\s+\w{1})/g, letter => letter.toUpperCase());
  return formatted;
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
        setEvents(data);
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

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startOfNextWeek = new Date(endOfWeek);
  startOfNextWeek.setDate(endOfWeek.getDate() + 1);
  
  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
  
  const eventosProximaSemana = events.filter(e => {
    const data = new Date(e.day);
    return data >= startOfNextWeek && data <= endOfNextWeek;
  });
  


  const eventosDoDia = events.filter(e => {
    const data = new Date(e.day);
    return data.toDateString() === today.toDateString();
  });

  const eventosDaSemana = events.filter(e => {
    const data = new Date(e.day);
    return (
      data >= startOfWeek &&
      data <= endOfWeek &&
      data.toDateString() !== today.toDateString()
    );
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
      <View
        style={[
          styles.card,
          { borderLeftColor: getStatusColor(event.status) },
        ]}
      >
        <Text style={styles.cardTitle}>{event.name}</Text>
        <Text style={styles.cardText}>
          Horário: {event.startTime} - {event.endTime}
        </Text>
        <Text
  style={[
    styles.statusTag,
    { backgroundColor: getStatusColor(event.status) },
  ]}
>
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
      <View
        style={[
          styles.card,
          { borderLeftColor: getStatusColor(event.status) },
        ]}
      >
        <Text style={styles.cardTitle}>{event.name}</Text>
        <Text style={styles.cardText}>
          Data: {new Date(event.day).toLocaleDateString("pt-BR")}
        </Text>
        <Text
  style={[
    styles.statusTag,
    { backgroundColor: getStatusColor(event.status) },
  ]}
>
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
      <View
        style={[
          styles.card,
          { borderLeftColor: getStatusColor(event.status) },
        ]}
      >
        <Text style={styles.cardTitle}>{event.name}</Text>
        <Text style={styles.cardText}>
          Data: {new Date(event.day).toLocaleDateString("pt-BR")}
        </Text>
        <Text
  style={[
    styles.statusTag,
    { backgroundColor: getStatusColor(event.status) },
  ]}
>
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
