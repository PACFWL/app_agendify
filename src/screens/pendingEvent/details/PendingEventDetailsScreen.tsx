import React, { useState, useContext,useCallback } from "react";
import { View, Text, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from "react-native";
import { RouteProp, useRoute,useFocusEffect } from "@react-navigation/native";
import { getPendingEventById,deletePendingEvent } from "../../../api/pendingEvent";
import { AuthContext } from "../../../contexts/AuthContext";
import { RootStackParamList } from "../../../routes/Routes";
import { getUserById } from "../../../api/user"; 
import { useNavigation } from "@react-navigation/native"; 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./PendingEventDetailsScreen.styles";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { getColors } from "../../../styles/ThemeColors.styles";

type PendingEventDetailsRouteProp = RouteProp<RootStackParamList, "PendingEventDetails">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "PendingEventDetails">;

export type PendingEvent = {
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
  eventRequesterId?: string;
}

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
    PLANEJADO: "Planejado",
    EM_BREVE: "Em Breve",
    EM_ANDAMENTO: "Em Andamento",
    EM_PAUSA: "Em Pausa",
    FINALIZADO: "Finalizado",
    EM_ANALISE: "Em Análise",
    INDETERMINADO: "Indeterminado"
  };
  return map[status] || status;
};

const formatAdministrativeStatus = (status: string) => {
  const map: { [key: string]: string } = {
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

const formatDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return isoDuration;

  const [, hours, minutes, seconds] = match.map(v => v ? parseInt(v) : 0);

  const parts = [];
  if (hours) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
  if (minutes) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
  if (seconds) parts.push(`${seconds} segundo${seconds > 1 ? 's' : ''}`);

  return parts.length ? parts.join(" e ") : "0 minuto";
};

const PendingEventDetailsScreen = () => {
  const route = useRoute<PendingEventDetailsRouteProp>();
  const { eventId } = route.params;
  const auth = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const themeColors = getColors(theme);
  const [pendingEvent, setPendingEvent] = useState<PendingEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();
  const [requesterName, setRequesterName] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      
      const fetchPendingEvent = async () => {
        try {
          if (auth?.user) {
            const data = await getPendingEventById(auth.user.token, eventId);
            setPendingEvent(data);
          }
        } catch (error) {
          Alert.alert("Erro", "Erro ao carregar detalhes do evento pendente.");
        } finally {
          setLoading(false);
        }
      };
      fetchPendingEvent();
    }, [eventId])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchRequester = async () => {
        if (auth?.user && pendingEvent?.eventRequesterId) {
          try {
            const user = await getUserById(auth.user.token, pendingEvent.eventRequesterId);
            setRequesterName(user.name);
          } catch (error) {
            console.warn("Erro ao buscar solicitante:", error);
          }
        }
      };
  
      fetchRequester();
    }, [pendingEvent?.eventRequesterId])
  );
  
  const handleDelete = async () => {
    if (!auth?.user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
  
    try {
      await deletePendingEvent(auth.user.token, eventId);
      Alert.alert("Sucesso", "Evento deletado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Erro ao deletar evento.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!pendingEvent) {
    return (
      <View style={styles.container}>
        <Text>Evento pendente não encontrado.</Text>
      </View>
    );
  }

const requesterValue = pendingEvent.eventRequesterId ? (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate("UserDetails", {
        userId: pendingEvent.eventRequesterId!,
      })
    }
  >
    <Text
      style={[
        styles.requesterLink,
        { color: themeColors.link, textDecorationLine: "underline", fontWeight: "500" }
      ]}
    >
      {requesterName ?? pendingEvent.eventRequesterId}
    </Text>
  </TouchableOpacity>
) : "Não informado";

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.title, { color: themeColors.primary }]}>{pendingEvent.name}</Text>

      <View style={[styles.detailCard, { backgroundColor: themeColors.card }]}>
    {[
      ["Data", new Date(pendingEvent.day).toLocaleDateString("pt-BR")],
      ["Horário", `${pendingEvent.startTime} - ${pendingEvent.endTime}`],
      ["Tema", pendingEvent.theme],
      ["Público-alvo", pendingEvent.targetAudience],
      ["Modalidade", formatMode(pendingEvent.mode)],
      ["Ambiente", pendingEvent.environment],
      ["Organizador", pendingEvent.organizer],
      ["Recursos", pendingEvent.resourcesDescription.join(", ")],
      ["Divulgação", pendingEvent.disclosureMethod],
      ["Assuntos Relacionados", pendingEvent.relatedSubjects.join(", ")],
      ["Estratégia de Ensino", pendingEvent.teachingStrategy],
      ["Autores", pendingEvent.authors.join(", ")],
      ["Cursos", pendingEvent.courses.join(", ")],
      ["Vínculo Disciplinar", pendingEvent.disciplinaryLink],
      ["Localização", `${pendingEvent.location.name} - ${pendingEvent.location.floor}`],
      ["Status", formatStatus(pendingEvent.status)],
      ["Status Administrativo", formatAdministrativeStatus(pendingEvent.administrativeStatus)],
      ["Prioridade", formatPriority(pendingEvent.priority)],
      ["Observação", pendingEvent.observation],
      ["Solicitante", requesterValue],
      ["Duração da Limpeza", formatDuration(pendingEvent.cleanupDuration)],
      ["Criado em", new Date(pendingEvent.createdAt).toLocaleString("pt-BR")],
      ["Última Modificação", new Date(pendingEvent.lastModifiedAt).toLocaleString("pt-BR")],
    ].map(([label, value], idx) => (
      <View key={idx} style={styles.detailRow}>
        <Text style={[styles.label, { color: themeColors.primary }]}>{label}:</Text>
        <Text style={[styles.value, { color: themeColors.cardText }]}>{value}</Text>
      </View>
    ))}
  </View>
        
      <View style={styles.buttonContainer}>
      {auth?.user?.role && ["MASTER", "REQUESTER"].includes(auth.user.role) && (
          <>
            <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={() => navigation.navigate("PendingEventEditForm", { eventId })}>
              <Text style={styles.buttonText}>Editar Evento Pendente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleDelete}>
              <Text style={styles.buttonText}>Deletar Evento Pendente</Text>
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

export default PendingEventDetailsScreen;