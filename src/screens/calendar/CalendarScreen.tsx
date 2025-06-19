import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext"; 
import { getAllEvents } from "../../api/event";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import { useNavigation } from "@react-navigation/native";
import { LocaleConfig } from "react-native-calendars";
import getCalendarScreenStyles from "../../styles/CalendarScreenStyles";
import { getColors } from "../../styles/ThemeColors";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


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

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ],
  monthNamesShort: [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ],
  dayNames: [
    "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
  today: "Hoje"
};

LocaleConfig.defaultLocale = "pt-br";

const getTodayInSaoPaulo = (): string => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find(p => p.type === "year")?.value;
  const month = parts.find(p => p.type === "month")?.value;
  const day = parts.find(p => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
};

const formatMonthYear = (dateString: string): string => {
  const [year, month] = dateString.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
  });
};

const CalendarScreen = () => {
  const auth = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const styles = getCalendarScreenStyles(theme);
  const navigation = useNavigation<NavigationProps>();
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [nowInBrazil, setNowInBrazil] = useState("");
  const [currentMonthText, setCurrentMonthText] = useState("");

  const todaySP = getTodayInSaoPaulo();

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
    });
    setCurrentMonthText(formatted);
  }, []);

useFocusEffect(
  useCallback(() => {
    const fetchEvents = async () => {
      if (!auth?.user) return;
      try {
        const data: EventType[] = await getAllEvents(auth.user.token);
        setEvents(data);
        markDates(data);
      } catch (error) {
        console.error("Erro ao carregar eventos", error);
      }
    };

    fetchEvents();
  }, [auth])
);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setNowInBrazil(now);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const markDates = (events: EventType[]) => {
    const newMarks: { [key: string]: any } = {};

    events.forEach((event) => {
      newMarks[event.day] = {
        ...(newMarks[event.day] || {}),
        marked: true,
        dotColor: "#0288d1",
      };
    });

    newMarks[todaySP] = {
      ...(newMarks[todaySP] || {}),
      customStyles: {
        container: {
          backgroundColor: "#FFF9C4",
        },
        text: {
          color: "#F57C00",
          fontWeight: "bold",
        },
      },
    };

    const today = new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const formattedDate = formatter.format(today);
    const baseDate = new Date(`${formattedDate}T00:00:00`);
    const start = new Date(baseDate);
    start.setDate(start.getDate() - baseDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = formatter.format(date);

      if (dateStr !== todaySP) {
        newMarks[dateStr] = {
          ...(newMarks[dateStr] || {}),
          customStyles: {
            container: {
              backgroundColor: "#F1F8E9",
            },
            text: {
              color: "#33691E",
            },
          },
        };
      }
    }

    setMarkedDates(newMarks);
  };

  const eventsForSelectedDate = events
    .filter((event) => event.day === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

return (
    <View style={styles.container}>
      <Text style={styles.titleToday}>{nowInBrazil}</Text>

      <Calendar
        markingType="custom"
      theme={{
          calendarBackground: getColors(theme).background,
          dayTextColor: getColors(theme).text,
          monthTextColor: getColors(theme).primary,
          selectedDayBackgroundColor: getColors(theme).primary,
          todayTextColor: getColors(theme).accent,
          arrowColor: getColors(theme).primary,
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        onMonthChange={(month) => {
          const formatted = formatMonthYear(month.dateString);
          setCurrentMonthText(formatted);
        }}
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              ...(markedDates[selectedDate] || {}),
              customStyles: {
                container: { backgroundColor: "#1976d2" },
                text: { color: "white", fontWeight: "bold" },
              },
            },
          }),
        }}
        renderHeader={() => (
          <Text style={styles.titleCalendar}>{currentMonthText}</Text>
        )}
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
            onPress={() =>
              navigation.navigate("EventDetails", { eventId: item.id })
            }
          >
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={{ color: getColors(theme).text }}>{`${item.startTime} - ${item.endTime}`}</Text>
            <Text style={{ color: getColors(theme).text }}>Status: {item.status}</Text>
            <Text style={{ color: getColors(theme).text }}>{`${item.location.name} - ${item.location.floor}`}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

export default CalendarScreen;