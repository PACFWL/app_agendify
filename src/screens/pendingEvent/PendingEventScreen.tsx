import React, { useState, useContext, useCallback } from "react";
import { View,Text,FlatList,ActivityIndicator,Alert,TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllPendingEvents,getMyPendingEvents,approvePendingEvent,rejectPendingEvent } from "../../api/pendingEvent";
import styles from "../../styles/PendingEventScreenStyles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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

type UserType = {
  id: string;
  token: string;
  name: string;
  role: "MASTER" | "REQUESTER" | "USER";
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
    <View style={styles.eventCard}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("PendingEventDetails", { eventId: event.id })
        }
      >
        <Text style={styles.eventDate}>{event.day}</Text>
        <Text style={styles.eventName}>{event.name}</Text>
        <View style={styles.eventInfoRow}>
          <Text style={styles.eventTime}>
            {`${event.startTime} - ${event.endTime}`}
          </Text>
          <Text style={styles.eventTheme}>{event.theme}</Text>
        </View>
        <Text style={styles.eventOrganizer}>
          Organizador: {event.organizer}
        </Text>
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
