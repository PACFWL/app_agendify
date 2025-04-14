import React, { useEffect, useState, useContext,useCallback } from "react";
import {View,Text,FlatList,ActivityIndicator,Alert,TouchableOpacity} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllPendingEvents, getMyPendingEvents} from "../../api/pendingEvent";
import styles from "../../styles/PendingEventScreenStyles";
import { useNavigation,useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";

type PendingEvent = {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  theme: string;
  organizer: string;
};

const EventCard = ({ event }: { event: PendingEvent }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("PendingEventDetails", { eventId: event.id })
      }
      style={styles.eventCard}
    >
      <Text style={styles.eventName}>{event.name}</Text>
      <Text>{`Data: ${event.day} - ${event.startTime} às ${event.endTime}`}</Text>
      <Text>{`Tema: ${event.theme}`}</Text>
      <Text>{`Organizador: ${event.organizer}`}</Text>
    </TouchableOpacity>
  );
};

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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        await fetchMyEvents();
        if (isMaster) await fetchAllEvents();
        setLoading(false);
      };

      load();
    }, [user])
  );

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
        <View style={styles.myEventsHeader}>
          <Text style={styles.myEventsHeaderText}>Meus eventos pendentes</Text>
        </View>
      )}

      {renderList()}

      {(user.role === "MASTER" || user.role === "REQUESTER") && (
  <TouchableOpacity
    style={styles.createButton}
    onPress={() => navigation.navigate("PendingEventForm")}
  >
    <Text style={styles.createButtonText}>+ Criar Evento Pendente</Text>
  </TouchableOpacity>
)}

    </View>
  );
};

export default PendingEventScreen;
