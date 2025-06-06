import React, { useState, useContext, useCallback } from "react";
import { View,Text,FlatList,ActivityIndicator,Alert,TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllPendingEvents,getMyPendingEvents,approvePendingEvent,rejectPendingEvent } from "../../api/pendingEvent";
import styles from "../../styles/PendingEventScreenStyles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getColors } from "../../styles/ThemeColors";

type PendingEvent = {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  theme: string;
  mode: string;
  organizer: string;
  location: { name: string; floor: string };
  priority: string;
  status: string;
};

type UserType = {
  id: string;
  token: string;
  name: string;
  role: "MASTER" | "REQUESTER" | "USER";
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
  user,
  onAction,
}: {
  event: PendingEvent;
  user: UserType;
  onAction: () => void;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

       const { theme } = useContext(ThemeContext);
 const colors = getColors(theme);


  const handleApprove = async () => {
    try {
      const result = await approvePendingEvent(user.token, event.id);
      if (result?.conflict) {
        navigation.navigate("PendingConflictResolution", {
          existingEvent: result.conflictData.existingEvent,
          pendingEvent: event,
        });
      } else {
        Alert.alert("Sucesso", "Evento aprovado com sucesso!");
        onAction();
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao aprovar o evento.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectPendingEvent(user.token, event.id);
      Alert.alert("Sucesso", "Evento rejeitado com sucesso!");
      onAction();
    } catch (error) {
      Alert.alert("Erro", "Erro ao rejeitar o evento.");
    }
  };

  return (
    <View style={[styles.eventCard, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("PendingEventDetails", { eventId: event.id })
        }
      >
        <Text style={[styles.eventDate, { color: colors.accent }]}>{event.day}</Text>
        <Text style={[styles.eventName, { color: colors.cardTitle }]}>{event.name}</Text>
        <View style={styles.eventInfoRow}>
          <Text style={[styles.eventTime, { color: colors.cardText }]}>
            {`${event.startTime} - ${event.endTime}`}
          </Text>
          <Text style={[styles.eventTheme, { color: colors.noEventText }]}>Tema: {event.theme}</Text>
        </View>
        <Text style={[styles.eventOrganizer, { color: colors.cardText }]}>
          Organizador: {event.organizer}
        </Text>
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
                ]}>
                Piso: {event.location.floor}
              </Text>
            </View>
  <View style={styles.tagsRow}>
        {user.role === "MASTER" && (
  <Text
    style={[
      styles.tag,
      { backgroundColor: getPriorityColor(event.priority) },
    ]}
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

      {user.role === "MASTER" && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
            <Text style={styles.approveButtonText}>Aprovar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
            <Text style={styles.rejectButtonText}>Rejeitar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const Loading = () => (
  
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#1976d2" />
    <Text>Carregando eventos pendentes...</Text>
  </View>
);

const PendingEventScreen = () => {
  const auth = useContext(AuthContext);
         const { theme } = useContext(ThemeContext);
 const colors = getColors(theme);


  const [myEvents, setMyEvents] = useState<PendingEvent[]>([]);
  const [allEvents, setAllEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"my" | "all">("my");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!auth?.user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Usuário não autenticado.</Text>
      </View>
    );
  }

  const { user } = auth;
  const isMaster = user.role === "MASTER";

  const fetchMyEvents = async () => {
    try {
      const data = await getMyPendingEvents(user.token);
      setMyEvents(data);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar seus eventos pendentes.");
    }
  };

  const fetchAllEvents = async () => {
    try {
      const data = await getAllPendingEvents(user.token);
      setAllEvents(data);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar todos os eventos pendentes.");
    }
  };

  const load = async () => {
    setLoading(true);
    await fetchMyEvents();
    if (isMaster) await fetchAllEvents();
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [user])
  );

  const renderList = () => {

  const Loading = () => (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.text, marginTop: 10 }}>Carregando eventos...</Text>
    </View>
  );

    if (loading) return <Loading />;
    const data = activeTab === "my" ? myEvents : allEvents;

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard event={item} user={user} onAction={load} />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Eventos Pendentes</Text>

      {isMaster && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("my")}
            style={[
              styles.tabButton,
              styles.tabButtonLeft,
              activeTab === "my"
                ? styles.tabButtonActive
                : styles.tabButtonInactive,
            ]}
          >
            <Text
              style={
                activeTab === "my"
                  ? styles.tabButtonTextActive
                  : styles.tabButtonTextInactive
              }
            >
              Meus eventos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("all")}
            style={[
              styles.tabButton,
              styles.tabButtonRight,
              activeTab === "all"
                ? styles.tabButtonActive
                : styles.tabButtonInactive,
            ]}
          >
            <Text
              style={
                activeTab === "all"
                  ? styles.tabButtonTextActive
                  : styles.tabButtonTextInactive
              }
            >
              Todos os eventos
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!isMaster && (
        <View style={[styles.myEventsHeader, { backgroundColor: colors.primary }]}>
          <Text style={styles.myEventsHeaderText}>Meus eventos pendentes</Text>
        </View>
      )}

      {renderList()}

      {(user.role === "MASTER" || user.role === "REQUESTER") && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("PendingEventForm")}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PendingEventScreen;
