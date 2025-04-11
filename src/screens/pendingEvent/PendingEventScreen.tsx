import React, { useEffect, useState, useContext } from "react";
import {View,Text,FlatList,ActivityIndicator,Alert,TouchableOpacity} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import {getAllPendingEvents,getMyPendingEvents} from "../../api/pendingEvent";
import styles from "../../styles/PendingEventScreenStyles";

type PendingEvent = {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  theme: string;
  organizer: string;
};

const EventCard = ({ event }: { event: PendingEvent }) => (
  <View style={styles.eventCard}>
    <Text style={styles.eventName}>{event.name}</Text>
    <Text>{`Data: ${event.day} - ${event.startTime} às ${event.endTime}`}</Text>
    <Text>{`Tema: ${event.theme}`}</Text>
    <Text>{`Organizador: ${event.organizer}`}</Text>
  </View>
);

const Loading = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6200ee" />
    <Text>Carregando eventos pendentes...</Text>
  </View>
);

const PendingEventScreen = () => {
  const auth = useContext(AuthContext);
  const [myEvents, setMyEvents] = useState<PendingEvent[]>([]);
  const [allEvents, setAllEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"my" | "all">("my");

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchMyEvents();
      if (isMaster) await fetchAllEvents();
      setLoading(false);
    };
    load();
  }, [user]);

  const renderList = () => {
    if (loading) return <Loading />;

    const data = activeTab === "my" ? myEvents : allEvents;

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos Pendentes</Text>

      {isMaster && (
        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setActiveTab("my")}
            style={{
              flex: 1,
              backgroundColor: activeTab === "my" ? "#6200ee" : "#e0e0e0",
              padding: 10,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            }}
          >
            <Text
              style={{
                color: activeTab === "my" ? "#fff" : "#000",
                textAlign: "center",
              }}
            >
              Meus eventos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("all")}
            style={{
              flex: 1,
              backgroundColor: activeTab === "all" ? "#6200ee" : "#e0e0e0",
              padding: 10,
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <Text
              style={{
                color: activeTab === "all" ? "#fff" : "#000",
                textAlign: "center",
              }}
            >
              Todos os eventos
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!isMaster && (
        <Text style={{ fontWeight: "bold", marginBottom: 16 }}>
          Meus eventos pendentes
        </Text>
      )}

      {renderList()}
    </View>
  );
};

export default PendingEventScreen;
