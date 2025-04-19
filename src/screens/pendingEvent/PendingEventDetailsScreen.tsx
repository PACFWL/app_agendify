import React, { useEffect, useState, useContext,useCallback } from "react";
import { View, Text, ActivityIndicator, Alert, ScrollView, Button } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { getPendingEventById,deletePendingEvent } from "../../api/pendingEvent";
import { AuthContext } from "../../contexts/AuthContext";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/PendingEventDetailsScreenStyles";
import { getUserById } from "../../api/user"; 
import { useNavigation } from "@react-navigation/native"; 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from '@react-navigation/native';

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
    case "PRESENCIAL":
      return "Presencial";
    case "ONLINE":
      return "Online";
    case "HIBRIDO":
      return "Híbrido";
    default:
      return mode;
  }
};

const formatStatus = (status: string) => {
  const map: { [key: string]: string } = {
    PLANEJADO: "Planejado",
    EM_BREVE: "Em Breve",
    EM_ANDAMENTO: "Em Andamento",
    EM_PAUSA: "Em Pausa",
    URGENTE: "Urgente",
    FINALIZADO: "Finalizado",
    CANCELADO: "Cancelado",
    ADIADO: "Adiado",
    ATRASADO: "Atrasado",
    INDEFINIDO: "Indefinido",
    APROVADO: "Aprovado",
    PENDENTE: "Pendente",
    EM_ANALISE: "Em Análise"
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
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!pendingEvent) {
    return (
      <View style={styles.center}>
        <Text>Evento pendente não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{pendingEvent.name}</Text>

        <Text style={styles.label}>Data:</Text>
        <Text style={styles.value}>
          {new Date(pendingEvent.day).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>

        <Text style={styles.label}>Horário:</Text>
        <Text style={styles.value}>
        <Text style={styles.label}>Início:</Text> {new Date(`1970-01-01T${pendingEvent.startTime}`).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
        <Text style={styles.label}>Término:</Text> {new Date(`1970-01-01T${pendingEvent.endTime}`).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>

        <Text style={styles.label}>Tema:</Text>
        <Text style={styles.value}>{pendingEvent.theme}</Text>

        <Text style={styles.label}>Organizador:</Text>
        <Text style={styles.value}>{pendingEvent.organizer}</Text>

        <Text style={styles.label}>Público-alvo:</Text>
        <Text style={styles.value}>{pendingEvent.targetAudience}</Text>

        <Text style={styles.label}>Modalidade:</Text>
        <Text style={styles.value}>{formatMode(pendingEvent.mode)}</Text>

        <Text style={styles.label}>Ambiente:</Text>
        <Text style={styles.value}>{pendingEvent.environment}</Text>

        <Text style={styles.label}>Recursos:</Text>
        <Text style={styles.value}>
          {pendingEvent.resourcesDescription?.join(", ") || "Nenhum"}
        </Text>

        <Text style={styles.label}>Forma de Divulgação:</Text>
        <Text style={styles.value}>{pendingEvent.disclosureMethod}</Text>

        <Text style={styles.label}>Disciplinas Relacionadas:</Text>
        <Text style={styles.value}>
          {pendingEvent.relatedSubjects?.join(", ") || "Nenhuma"}
        </Text>

        <Text style={styles.label}>Estratégia de Ensino:</Text>
        <Text style={styles.value}>{pendingEvent.teachingStrategy}</Text>

        <Text style={styles.label}>Autores:</Text>
        <Text style={styles.value}>
          {pendingEvent.authors?.join(", ") || "Nenhum"}
        </Text>

        <Text style={styles.label}>Cursos:</Text>
        <Text style={styles.value}>
          {pendingEvent.courses?.join(", ") || "Nenhum"}
        </Text>

        <Text style={styles.label}>Vínculo Disciplinar:</Text>
        <Text style={styles.value}>{pendingEvent.disciplinaryLink}</Text>

        <Text style={styles.label}>Localização:</Text>
        <Text style={styles.value}><Text style={styles.label}>Local:</Text> {pendingEvent.location.name} - <Text style={styles.label}>Andar:</Text> {pendingEvent.location.floor}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{formatStatus(pendingEvent.status)}</Text>

        <Text style={styles.label}>Status Administrativo:</Text>
        <Text style={styles.value}>{formatAdministrativeStatus(pendingEvent.administrativeStatus)}</Text>

        <Text style={styles.label}>Prioridade:</Text>
        <Text style={styles.value}>{formatPriority(pendingEvent.priority)}</Text>

        <Text style={styles.label}>Tempo de Intervalo:</Text>
        <Text style={styles.value}>{formatDuration(pendingEvent.cleanupDuration)}</Text>

        <Text style={styles.label}>Observações:</Text>
        <Text style={styles.value}>{pendingEvent.observation || "Nenhuma"}</Text>

        <Text style={styles.label}>Solicitante:</Text>
        {pendingEvent.eventRequesterId && (
          <Text
            style={styles.requesterLink}
            onPress={() =>
              navigation.navigate("UserDetails", { userId: pendingEvent.eventRequesterId! })
            }
          >
            {requesterName ?? pendingEvent.eventRequesterId}
          </Text>
        )}
        <Text style={styles.label}>Criado em:</Text>
        <Text style={styles.value}>
          {new Date(pendingEvent.createdAt).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            hour12: false,
          })}
        </Text>

        <Text style={styles.label}>Última modificação:</Text>
        <Text style={styles.value}>
          {new Date(pendingEvent.lastModifiedAt).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            hour12: false,
          })}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
      {auth?.user?.role && ["MASTER", "REQUESTER"].includes(auth.user.role) && (
  <>
     <Button
      title="Editar Evento"
      onPress={() => navigation.navigate("PendingEventEditForm", { eventId })}
      color="orange"
    />
    <Button
      title="Deletar Evento"
      onPress={handleDelete}
      color="red"
    />
  </>
)}
  <Button title="Voltar" onPress={() => navigation.goBack()} color="#6200ee" />
</View>

    </ScrollView>
  );
};

export default PendingEventDetailsScreen;