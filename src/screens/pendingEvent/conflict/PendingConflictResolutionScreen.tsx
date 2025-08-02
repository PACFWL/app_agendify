import React, { useContext } from "react";
import { Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../routes/Routes";
import { AuthContext } from "../../../contexts/AuthContext";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { getColors } from "../../../styles/ThemeColors.styles";
import { resolvePendingEventConflict } from "../../../api/pendingEvent";
import styles from "./PendingConflictResolutionScreen.styles"; 

type ScreenRouteProp = RouteProp<RootStackParamList, "PendingConflictResolution">;


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

const formatLocationFloor = (locationFloor: string) => {
  const map: { [key: string]: string } = {
    0: "Térreo",
    1: "1º Andar",
    2: "2º Andar",
    3: "3º Andar",
    4: "Online"
  };
  return map[locationFloor] || locationFloor;
};

const PendingConflictResolutionScreen = () => {
  const { params } = useRoute<ScreenRouteProp>();
  const { existingEvent, pendingEvent } = params;
  const { user } = useContext(AuthContext)!;
  const navigation = useNavigation();

  const { theme } = useContext(ThemeContext);
  const themeColors = getColors(theme);

  const handleResolve = async () => {
    try {
      await resolvePendingEventConflict(user!.token, existingEvent.id, pendingEvent.id);
      Alert.alert("Conflito resolvido", "O evento pendente foi aprovado com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao resolver o conflito:", error);
      Alert.alert("Erro", "Erro ao resolver o conflito.");
    }
  };

  const renderEventDetails = (event: any, title: string) => (
    <>
      <Text style={[styles.sectionTitle, { color: themeColors.cardTitle }]}>{title}</Text>
      <Text style={{ color: themeColors.cardText }}>Nome: {event.name}</Text>
      <Text style={{ color: themeColors.cardText }}>Data: {event.day}</Text>
      <Text style={{ color: themeColors.cardText }}>Horário: {event.startTime} - {event.endTime}</Text>
      <Text style={{ color: themeColors.cardText }}>Tema: {event.theme}</Text>
      <Text style={{ color: themeColors.cardText }}>Público-alvo: {event.targetAudience}</Text>
      <Text style={{ color: themeColors.cardText }}>Modalidade: {formatMode(event.mode)}</Text>
      <Text style={{ color: themeColors.cardText }}>Ambiente: {event.environment}</Text>
      <Text style={{ color: themeColors.cardText }}>Organizador: {event.organizer}</Text>
      <Text style={{ color: themeColors.cardText }}>Recursos: {event.resourcesDescription?.join(", ")}</Text>
      <Text style={{ color: themeColors.cardText }}>Forma de Divulgação: {event.disclosureMethod}</Text>
      <Text style={{ color: themeColors.cardText }}>Disciplinas Relacionadas: {event.relatedSubjects?.join(", ")}</Text>
      <Text style={{ color: themeColors.cardText }}>Estratégia de Ensino: {event.teachingStrategy}</Text>
      <Text style={{ color: themeColors.cardText }}>Autores: {event.authors?.join(", ")}</Text>
      <Text style={{ color: themeColors.cardText }}>Cursos: {event.courses?.join(", ")}</Text>
      <Text style={{ color: themeColors.cardText }}>Vínculo Disciplinar: {event.disciplinaryLink}</Text>
      <Text style={{ color: themeColors.cardText }}>Local: {event.location?.name} - Andar: {formatLocationFloor(event.location?.floor)}</Text>
      <Text style={{ color: themeColors.cardText }}>Status: {formatStatus(event.status)}</Text>
      <Text style={{ color: themeColors.cardText }}>Status Administrativo: {formatAdministrativeStatus(event.administrativeStatus)}</Text>
      <Text style={{ color: themeColors.cardText }}>Prioridade: {formatPriority(event.priority)}</Text>
      <Text style={{ color: themeColors.cardText }}>Duração da Limpeza: {formatDuration(event.cleanupDuration)}</Text>
      <Text style={{ color: themeColors.cardText }}>Observação: {event.observation}</Text>
    </>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Text style={[styles.title, { color: themeColors.primary }]}>Conflito de Eventos</Text>

      {renderEventDetails(existingEvent, "Evento Existente")}
      {renderEventDetails(pendingEvent, "Evento Pendente")}

      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: themeColors.error }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.cancelButtonText, { color: themeColors.statusText }]}>Cancelar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.resolveButton, { backgroundColor: themeColors.success }]}
        onPress={handleResolve}
      >
        <Text style={[styles.resolveButtonText, { color: themeColors.statusText }]}>Aprovar Mesmo Assim</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PendingConflictResolutionScreen;