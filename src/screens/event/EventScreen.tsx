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
  location: { name: string; floor: string };
  priority: string;
  status: string;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "CRITICA": return "#d32f2f";
    case "ALTA": return "#f57c00";
    case "MEDIA": return "#fbc02d";
    case "BAIXA": return "#388e3c";
    case "MUITO_BAIXA": return "#0288d1";
    default: return "#90a4ae";
  }
};

const formatMode = (mode: string) => {
  switch (mode) {
    case "PRESENCIAL": return "Presencial";
    case "ONLINE": return "Online";
    case "HIBRIDO": return "Híbrido";
    default: return mode;
  }
};

const formatStatus = (status: string) => {
  const map: { [key: string]: string } = {
    INDETERMINADO: "Indeterminado",
    PLANEJADO: "Planejado",
    EM_BREVE: "Em Breve",
    EM_ANDAMENTO: "Em Andamento",
    EM_PAUSA: "Em Pausa",
    FINALIZADO: "Finalizado",
    EM_ANALISE: "Em Análise"
  };
  return map[status] || status;
};

const getModeColor = (mode: string) => {
  switch (mode) {
    case "PRESENCIAL": return "#43a047";
    case "ONLINE": return "#1976d2";
    case "HIBRIDO": return "#8e24aa";
    default: return "#90a4ae";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "INDETERMINADO": return "#9e9e9e";
    case "PLANEJADO": return "#0288d1";
    case "EM_BREVE": return "#fbc02d";
    case "EM_ANDAMENTO": return "#43a047";
    case "EM_PAUSA": return "#f57c00";
    case "FINALIZADO": return "#455a64";
    case "EM_ANALISE": return "#7b1fa2";
    default: return "#90a4ae";
  }
};

const getLocationColor = (name: string) => {
  if (name === "A definir") return "#d32f2f";
  return "#1976d2";
};

const formatPriority = (priority: string) => {
  const map: { [key: string]: string } = {
    INDEFINIDO: "Indefinido",
    MUITO_BAIXA: "Muito Baixa",
    BAIXA: "Baixa",
    MEDIA: "Média",
    ALTA: "Alta",
    CRITICA: "Crítica"
  };
  return map[priority] || priority;
};

const EventCard = ({
  event,
  auth,
}: {
  event: Event;
  auth: React.ContextType<typeof AuthContext>;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const role = auth?.user?.role;

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

      <View style={styles.locationRow}>
        <Text
          style={[
            styles.tag,
            styles.locationTag,
            {
              backgroundColor: getLocationColor(event.location.name),
              borderWidth: event.location.name === "A definir" ? 1.5 : 0,
              borderColor: event.location.name === "A definir" ? "#b71c1c" : "transparent",
            },
          ]}
        >
          Local: {event.location.name}
        </Text>
        <Text
          style={[
            styles.tag,
            styles.locationTag,
            {
              backgroundColor: getLocationColor(event.location.floor),
              borderWidth: event.location.floor === "A definir" ? 1.5 : 0,
              borderColor: event.location.floor === "A definir" ? "#b71c1c" : "transparent",
            },
          ]}
        >
          Piso: {event.location.floor}
        </Text>
      </View>

      <View style={styles.tagsRow}>
        {role === "MASTER" && (
          <Text
            style={[styles.tag, { backgroundColor: getPriorityColor(event.priority) }]}
          >
            {formatPriority(event.priority)}
          </Text>
        )}

        <Text style={[styles.tag, { backgroundColor: getModeColor(event.mode) }]}>
          {formatMode(event.mode)}
        </Text>

        <Text style={[styles.tag, { backgroundColor: getStatusColor(event.status) }]}>
          {formatStatus(event.status)}
        </Text>
      </View>
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
        renderItem={({ item }) => <EventCard event={item} auth={auth} />}
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
