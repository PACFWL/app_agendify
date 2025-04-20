import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllEvents } from "../../api/event";
import { TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/CalendarScreenStyles";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

type EventType = {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  mode: string;
  status: string;
  location: { name: string; floor: string };
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

const CalendarScreen = () => {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<NavigationProps>();
  const [events, setEvents] = useState<EventType[]>([]); 
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean; dotColor: string } }>({});

  useEffect(() => {
    const fetchEvents = async () => {
      if (!auth?.user) return;
      try {
        const data: EventType[] = await getAllEvents(auth.user.token);
        setEvents(data);
        markEventDates(data);
      } catch (error) {
        console.error("Erro ao carregar eventos", error);
      }
    };
    fetchEvents();
  }, [auth]);

  const markEventDates = (events: EventType[]) => {
    let marks: { [key: string]: { marked: boolean; dotColor: string } } = {};
    events.forEach((event) => {
      marks[event.day] = { marked: true, dotColor: "blue" };
    });
    setMarkedDates(marks);
  };

  const eventsForSelectedDate = events
  .filter((event) => event.day === selectedDate)
  .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: "blue" },
        }}
      />
      <Text style={styles.title}>Eventos do Dia</Text>
      <FlatList
        data={eventsForSelectedDate}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.eventCard,
              { borderLeftColor: getStatusColor(item.status) },
            ]}
            onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
          >
            <Text style={styles.eventName}>{item.name}</Text>
            <Text>{`${item.startTime} - ${item.endTime}`}</Text>
            <Text>Status: {item.status}</Text>
            <Text>{`${item.location.name} - ${item.location.floor}`}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CalendarScreen;