import React, { useState, useContext, useCallback } from "react";
import { View, Text, Alert, ScrollView, TouchableOpacity, Switch } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import { RootStackParamList } from "../routes/Routes";
import getHomeScreenStyles from "../styles/HomeScreenStyles";
import { getAllEvents } from "../api/event";
import { ThemeContext, ThemeType } from "../contexts/ThemeContext";
import { getColors } from "../styles/ThemeColors";

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
  observation?: string;
};

const getThemeBackgroundColor = (theme: ThemeType): string => {
  return theme === "dark" ? "#9575cd" : "#7e57c2";
};

const getOrganizerColor = (theme: ThemeType): string => {
  return theme === "dark" ? "#1976d2" : "#90caf9";
};

const getTargetAudienceColor = (theme: ThemeType): string => {
  return theme === "dark" ? "#fbc02d" : "#ffd54f";
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


const formatStatusText = (status: string): string => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/(^\w{1}|\s+\w{1})/g, letter => letter.toUpperCase());
};


const getDateColorPorCategoria = (
  eventDateStr: string,
  baseDateStr: string,
  categoria: "destaque" | "hoje" | "semana" | "proxima"
): string => {
  const eventDate = new Date(eventDateStr);
  const baseDate = new Date(baseDateStr);

  const diffInMs = eventDate.getTime() - baseDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const maxDistance = 5;
  const clampedDiff = Math.max(-maxDistance, Math.min(maxDistance, diffInDays));

 
  const colorBases: Record<typeof categoria, { hue: number; saturation: number; lightness: number }> = {
    destaque: { hue: 220, saturation: 80, lightness: 50 }, 
    hoje: { hue: 170, saturation: 70, lightness: 45 },    
    semana: { hue: 40, saturation: 80, lightness: 50 },    
    proxima: { hue: 300, saturation: 65, lightness: 50 }, 
  };

  const base = colorBases[categoria];
  const lightness = base.lightness - clampedDiff * 5;

  return `hsl(${base.hue}, ${base.saturation}%, ${lightness}%)`;
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

  const colors = getColors(theme);

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

 const role = auth?.user?.role;

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

  const eventosVisiveis = [...eventosDoDia, ...eventosDaSemana, ...eventosProximaSemana];

  const eventoEmDestaque = eventosVisiveis
    .filter(e => new Date(e.day) >= today)
    .sort((a, b) => statusPriority[a.status] - statusPriority[b.status])[0];

  const eventoJaPassou = (evento: Event): boolean => {
    const agora = new Date();
    const fimEvento = new Date(evento.day + 'T' + evento.endTime);
    return fimEvento < agora;
  };

  const eventosComObservacao = eventosVisiveis.filter(e => e.observation);
  const eventosComObservacaoFuturos = eventosComObservacao.filter(e => !eventoJaPassou(e));
  const eventosComObservacaoPassados = eventosComObservacao.filter(e => eventoJaPassou(e));

  const contagemPorStatus = eventosVisiveis.reduce((acc, e) => {
    const status = eventoJaPassou(e) ? `${e.status}_PASSADO` : e.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatStatusText = (status: string): string => {
    const base = status.replace("_PASSADO", "");
    const texto = base
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/(^\w{1}|\s+\w{1})/g, letter => letter.toUpperCase());

    return status.endsWith("_PASSADO") ? `${texto} (Já ocorreu)` : texto;
  };

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

    <Text style={styles.dateText}>
      Hoje é {today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
    </Text>

    <View style={styles.summaryContainer}>
      <Text style={styles.summaryText}>Eventos hoje: {eventosDoDia.length}</Text>
      <Text style={styles.summaryText}>Semana atual: {eventosDaSemana.length}</Text>
      <Text style={styles.summaryText}>Semana que vem: {eventosProximaSemana.length}</Text>
    </View>

{eventoEmDestaque && (
  <View style={[styles.card, { borderLeftColor: getStatusColor(eventoEmDestaque.status) }]}>
    <Text style={styles.sectionTitle}>🎯 Evento em Destaque</Text>
    <Text style={styles.cardTitle}>{eventoEmDestaque.name}</Text>

    <View style={styles.tagsRow}>
      <Text
        style={[
          styles.tag,
          {
            backgroundColor: getDateColorPorCategoria(
              eventoEmDestaque.day,
              eventoEmDestaque.day,
              "destaque"
            ),
            color: colors.statusText,
          },
        ]}
      >
        🗓 Data: {new Date(eventoEmDestaque.day).toLocaleDateString("pt-BR")}
      </Text>
    </View>

    <View style={styles.tagsRow}>
      <Text style={[styles.tag, { backgroundColor: "#37474f", color: colors.statusText }]}>
        🕒 Início: {eventoEmDestaque.startTime}
      </Text>
      <Text style={[styles.tag, { backgroundColor: "#37474f", color: colors.statusText }]}>
        🕓 Término: {eventoEmDestaque.endTime}
      </Text>
    </View>

   
    <View style={styles.tagsRow}>
      <Text
        style={[
          styles.tag,
          {
            backgroundColor: getThemeBackgroundColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🎨 Tema: {eventoEmDestaque.theme}
      </Text>
      <Text
        style={[
          styles.tag,
          {
            backgroundColor: getTargetAudienceColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🎓 Público-Alvo: {eventoEmDestaque.targetAudience}
      </Text>
    </View>

 
    <View style={styles.tagsRow}>
      <Text
        style={[
          styles.tag,
          styles.locationTag,
          {
            backgroundColor: getLocationColor(eventoEmDestaque.location.name),
            borderWidth: eventoEmDestaque.location.name === "A definir" ? 1.5 : 0,
            borderColor: eventoEmDestaque.location.name === "A definir" ? "#b71c1c" : "transparent",
          },
        ]}
      >
        📍 Localidade: {eventoEmDestaque.location.name}
      </Text>
      <Text
        style={[
          styles.tag,
          styles.locationTag,
          {
            backgroundColor: getLocationColor(eventoEmDestaque.location.floor),
            borderWidth: eventoEmDestaque.location.floor === "A definir" ? 1.5 : 0,
            borderColor: eventoEmDestaque.location.floor === "A definir" ? "#b71c1c" : "transparent",
          },
        ]}
      >
        🗺 Piso: {eventoEmDestaque.location.floor}
      </Text>
    </View>

   
    <View style={styles.tagsRow}>
      <Text
        style={[
          styles.tag,
          {
            backgroundColor: getOrganizerColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🧑‍🏫 Organizador: {eventoEmDestaque.organizer}
      </Text>
    </View>

  
    <View style={styles.tagsRow}>
      {role === "MASTER" && (
        <Text
          style={[
            styles.tag,
            { backgroundColor: getPriorityColor(eventoEmDestaque.priority) },
          ]}
        >
          🔼 Prioridade: {formatPriority(eventoEmDestaque.priority)}
        </Text>
      )}
      <Text
        style={[
          styles.tag,
          { backgroundColor: getModeColor(eventoEmDestaque.mode) },
        ]}
      >
        🛠 Modalidade: {formatMode(eventoEmDestaque.mode)}
      </Text>
      <Text
        style={[
          styles.statusTag,
          { backgroundColor: getStatusColor(eventoEmDestaque.status) },
        ]}
      >
        📌 Status: {formatStatusText(eventoEmDestaque.status)}
      </Text>
    </View>
  </View>
)}

{eventosComObservacao.length > 0 && (
  <View style={styles.alertBox}>
    <Text style={styles.alertTitle}>📢 Avisos</Text>
{[...eventosComObservacaoFuturos, ...eventosComObservacaoPassados].slice(0, 10).map(e => (
  <Text key={e.id} style={styles.alertText}>
    • {e.name}: {e.observation}
    {eventoJaPassou(e) && " (já ocorreu)"}
  </Text>
))}
  </View>
)}

<View style={styles.statusSummaryContainer}>
  <Text style={styles.sectionTitle}>📊 Eventos por Status</Text>

  {Object.entries(contagemPorStatus).map(([status, count]) => (
    <View key={status} style={styles.statusRow}>
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(status) }]} />
      <Text style={styles.statusLabel}>
        {formatStatusText(status)}: {count}
      </Text>
    </View>
  ))}
</View>

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

        <View style={styles.tagsRow}>
          <Text
            style={[
              styles.tag,
              {
                backgroundColor: getDateColorPorCategoria(
                  event.day,
                  today.toISOString(),
                  "hoje"
                ),
                color: colors.statusText,
              },
            ]}
          >
            🗓 Data: {new Date(event.day).toLocaleDateString("pt-BR")}
          </Text>
        </View>

       
        <View style={styles.tagsRow}>
          <Text style={[styles.tag, { backgroundColor: "#37474f", color: colors.statusText }]}>
            ⏰ Início: {event.startTime}
          </Text>
          <Text style={[styles.tag, { backgroundColor: "#37474f", color: colors.statusText }]}>
            ⏰ Término: {event.endTime}
          </Text>
        </View>

     
        <View style={styles.tagsRow}>
       <Text
        style={[
          styles.tag,
          {
            backgroundColor: getThemeBackgroundColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🎯 Tema: {event.theme}
      </Text>

       <Text
        style={[
          styles.tag,
          {
            backgroundColor: getTargetAudienceColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🎓 Público-Alvo: {event.targetAudience}
      </Text>
        </View>

       
        <View style={styles.tagsRow}>
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
            📍 Localidade: {event.location.name}
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
            🗺 Piso: {event.location.floor}
          </Text>
        </View>
    

    <View style={styles.tagsRow}>
      <Text
        style={[
          styles.tag,
          {
            backgroundColor: getOrganizerColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🧑‍🏫 Organizador: {event.organizer}
      </Text>
    </View>


        <View style={styles.tagsRow}>
          {role === "MASTER" && (
            <Text style={[styles.tag, { backgroundColor: getPriorityColor(event.priority) }]}>
              🔼 Prioridade: {formatPriority(event.priority)}
            </Text>
          )}
          <Text style={[styles.tag, { backgroundColor: getModeColor(event.mode) }]}>
            🛠 Modalidade: {formatMode(event.mode)}
          </Text>
          <Text style={[styles.tag, { backgroundColor: getStatusColor(event.status) }]}>
            📌 Status: {formatStatus(event.status)}
          </Text>
        </View>
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

       <View style={styles.tagsRow}>
          <Text
            style={[
              styles.tag,
              {
                backgroundColor: getDateColorPorCategoria(
                  event.day,
                  startOfWeek.toISOString(),
                  "semana"
                ),
                color: colors.statusText,
              },
            ]}
          >
            🗓 Data: {new Date(event.day).toLocaleDateString("pt-BR")}
          </Text>
        </View>

       
        <View style={styles.tagsRow}>
          <Text style={[styles.tag, { backgroundColor: "#37474f", color: colors.statusText }]}>
            ⏰ Início: {event.startTime}
          </Text>
          <Text style={[styles.tag, { backgroundColor: "#37474f", color: colors.statusText }]}>
            ⏰ Término: {event.endTime}
          </Text>
        </View>

     
    <View style={styles.tagsRow}>
       <Text
        style={[
          styles.tag,
          {
            backgroundColor: getThemeBackgroundColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🎯 Tema: {event.theme}
      </Text>

       <Text
        style={[
          styles.tag,
          {
            backgroundColor: getTargetAudienceColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🎓 Público-Alvo: {event.targetAudience}
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
            📍 Localidade: {event.location.name}
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
            🗺 Piso: {event.location.floor}
          </Text>
        </View>
    
    <View style={styles.tagsRow}>
      <Text
        style={[
          styles.tag,
          {
            backgroundColor: getOrganizerColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🧑‍🏫 Organizador: {event.organizer}
      </Text>
    </View>

        <View style={styles.tagsRow}>
          {role === "MASTER" && (
            <Text style={[styles.tag, { backgroundColor: getPriorityColor(event.priority) }]}>
              🔼 Prioridade: {formatPriority(event.priority)}
            </Text>
          )}
          <Text style={[styles.tag, { backgroundColor: getModeColor(event.mode) }]}>
            🛠 Modalidade: {formatMode(event.mode)}
          </Text>
          <Text style={[styles.tag, { backgroundColor: getStatusColor(event.status) }]}>
            📌 Status: {formatStatus(event.status)}
          </Text>
        </View>
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

       <View style={styles.tagsRow}>
          <Text
            style={[
              styles.tag,
              {
                backgroundColor: getDateColorPorCategoria(
                  event.day,
                  startOfNextWeek.toISOString(),
                  "proxima"
                ),
                color: colors.statusText,
              },
            ]}
          >
            🗓 Data: {new Date(event.day).toLocaleDateString("pt-BR")}
          </Text>
        </View>

       
        <View style={styles.tagsRow}>
          <Text style={[styles.tag, { backgroundColor: "#37474f", color: colors.statusText }]}>
            ⏰ Início: {event.startTime}
          </Text>
          <Text style={[styles.tag, { backgroundColor: "#37474f", color: colors.statusText }]}>
            ⏰ Término: {event.endTime}
          </Text>
        </View>

     <View style={styles.tagsRow}>
       <Text
        style={[
          styles.tag,
          {
            backgroundColor: getThemeBackgroundColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🎯 Tema: {event.theme}
      </Text>

       <Text
        style={[
          styles.tag,
          {
            backgroundColor: getTargetAudienceColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🎓 Público-Alvo: {event.targetAudience}
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
            📍 Localidade: {event.location.name}
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
            🗺 Piso: {event.location.floor}
          </Text>
        </View>
    
    <View style={styles.tagsRow}>
      <Text
        style={[
          styles.tag,
          {
            backgroundColor: getOrganizerColor(theme),
            color: colors.statusText,
          },
        ]}
      >
        🧑‍🏫 Organizador: {event.organizer}
      </Text>
    </View>

        <View style={styles.tagsRow}>
          {role === "MASTER" && (
            <Text style={[styles.tag, { backgroundColor: getPriorityColor(event.priority) }]}>
              🔼 Prioridade: {formatPriority(event.priority)}
            </Text>
          )}
          <Text style={[styles.tag, { backgroundColor: getModeColor(event.mode) }]}>
            🛠 Modalidade: {formatMode(event.mode)}
          </Text>
          <Text style={[styles.tag, { backgroundColor: getStatusColor(event.status) }]}>
            📌 Status: {formatStatus(event.status)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ))
)}
    </ScrollView>
  );
};


export default HomeScreen;
