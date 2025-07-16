import React, { useState, useContext, useCallback } from "react";
import {View,Text,FlatList,ActivityIndicator,Alert,TouchableOpacity} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllEvents } from "../../api/event";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "../../styles/EventScreenStyles";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getColors } from "../../styles/ThemeColors";

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

const formatDateToBR = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
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
    
    const { theme } = useContext(ThemeContext);
    const colors = getColors(theme);

  const role = auth?.user?.role;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
      style={[styles.eventCard, { backgroundColor: colors.card }]}
    >
   
   <Text style={[styles.eventDate, { color: colors.accent }]}>
  {formatDateToBR(event.day)}
</Text>

  <Text style={[styles.eventName, { color: colors.cardTitle }]}>{event.name}</Text>

      <View style={styles.tagsRow}>
      <Text style={[styles.tag, { backgroundColor: "#37474f", color: colors.statusText }]}>
    Início: {event.startTime}
  </Text>

      <Text style={[styles.tag, { backgroundColor: "#37474f" }]}>
        Término: {event.endTime}
      </Text>

      <Text style={[styles.tag, { backgroundColor: "#6a1b9a" }]}>
        Tema: {event.theme}
      </Text>

      <Text style={[styles.tag, { backgroundColor: "#00796b" }]}>
        Organizador: {event.organizer}
      </Text>

    </View>

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

const EventScreen = () => {
  const auth = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
const colors = getColors(theme);

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

  const Loading = () => (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.text, marginTop: 10 }}>Carregando eventos...</Text>
    </View>
  );

  if (loading) return <Loading />;

  return (
  <View style={[styles.container, { backgroundColor: colors.background }]}>
  <Text style={[styles.title, { color: colors.primary }]}>Agenda de Eventos</Text>

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
  <Text style={[styles.fabIcon, { color: "#fff" }]}>＋</Text>
</TouchableOpacity>
      )}
    </View>
  );
};

export default EventScreen;
