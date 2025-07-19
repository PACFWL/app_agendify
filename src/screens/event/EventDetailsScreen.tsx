import React, { useState, useContext, useCallback } from "react";
import {View,Text,ActivityIndicator,ScrollView,Alert,TouchableOpacity} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { getEventById, deleteEvent } from "../../api/event";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/EventDetailsScreenStyles";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getColors } from "../../styles/ThemeColors";

type Props = NativeStackScreenProps<RootStackParamList, "EventDetails">;

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
  resourcesDescription: string[];
  disclosureMethod: string;
  relatedSubjects: string[];
  teachingStrategy: string;
  authors: string[];
  courses: string[];
  disciplinaryLink: string;
  location: { name: string; floor: string };
  observation: string;
  status: string;
  administrativeStatus: string;
  priority: string;
  cleanupDuration: string;
  createdAt: string;
  lastModifiedAt: string;
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

const formatAdministrativeStatus = (status: string) => {
  const map: { [key: string]: string } = {
    NORMAL: "Normal",
    CANCELADO: "Cancelado",
    URGENTE: "Urgente",
    ADIADO: "Adiado",
    ATRASADO: "Atrasado",
    INDEFINIDO: "Indefinido",
    APROVADO: "Aprovado",
    PENDENTE: "Pendente",
    AGUARDANDO: "Aguardando",
    RECUSADO: "Recusado",
  };
  return map[status] || status;
};

const formatDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return isoDuration;

  const [, hours, minutes, seconds] = match.map((v) => v ? parseInt(v) : 0);

  const parts = [];
  if (hours) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
  if (minutes) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
  if (seconds) parts.push(`${seconds} segundo${seconds > 1 ? 's' : ''}`);

  return parts.length ? parts.join(" e ") : "0 minuto";
};

const EventDetailsScreen = ({ route, navigation }: Props) => {
  const { eventId } = route.params;
  const auth = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
const themeColors = getColors(theme);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchEvent = async () => {
        if (!auth?.user) return;
        try {
          const data = await getEventById(auth.user.token, eventId);
          setEvent(data);
        } catch {
          Alert.alert("Erro", "Erro ao carregar detalhes do evento.");
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }, [auth, eventId])
  );

  const handleDelete = async () => {
    if (!auth?.user) return Alert.alert("Erro", "Usuário não autenticado.");
    try {
      await deleteEvent(auth.user.token, eventId);
      Alert.alert("Sucesso", "Evento deletado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Erro", "Erro ao deletar evento.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text>Carregando evento...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Evento não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.primary }]}>{event.name}</Text>
    <View style={[styles.detailCard, { backgroundColor: themeColors.card }]}>
    {[
      ["Data", new Date(event.day).toLocaleDateString("pt-BR")],
      ["Horário", `${event.startTime} - ${event.endTime}`],
      ["Tema", event.theme],
      ["Público-alvo", event.targetAudience],
      ["Modalidade", formatMode(event.mode)],
      ["Ambiente", event.environment],
      ["Organizador", event.organizer],
      ["Recursos", event.resourcesDescription.join(", ")],
      ["Divulgação", event.disclosureMethod],
      ["Assuntos Relacionados", event.relatedSubjects.join(", ")],
      ["Estratégia de Ensino", event.teachingStrategy],
      ["Autores", event.authors.join(", ")],
      ["Cursos", event.courses.join(", ")],
      ["Vínculo Disciplinar", event.disciplinaryLink],
      ["Localização", `${event.location.name} - ${event.location.floor}`],
      ["Status", formatStatus(event.status)],
      ["Status Administrativo", formatAdministrativeStatus(event.administrativeStatus)],
      ["Prioridade", formatPriority(event.priority)],
      ["Observação", event.observation],
      ["Duração da Limpeza", formatDuration(event.cleanupDuration)],
      ["Criado em", new Date(event.createdAt).toLocaleString("pt-BR")],
      ["Última Modificação", new Date(event.lastModifiedAt).toLocaleString("pt-BR")],
    ].map(([label, value], idx) => (
      <View key={idx} style={styles.detailRow}>
        <Text style={[styles.label, { color: themeColors.primary }]}>{label}:</Text>
        <Text style={[styles.value, { color: themeColors.cardText }]}>{value}</Text>
      </View>
    ))}
  </View>
      
      <View style={styles.buttonContainer}>
        {auth?.user?.role === "MASTER" && (
          <>
            <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={() => navigation.navigate("EventEditForm", { eventId })}>
              <Text style={styles.buttonText}>Editar Evento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleDelete}>
              <Text style={styles.buttonText}>Deletar Evento</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EventDetailsScreen;
