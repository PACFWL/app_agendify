import React, { useContext } from "react";
import { Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../routes/Routes";
import { AuthContext } from "../../contexts/AuthContext";
import { resolvePendingEventConflict } from "../../api/pendingEvent";
import styles from "../../styles/PendingConflictResolutionScreenStyles"; 

type ScreenRouteProp = RouteProp<RootStackParamList, "PendingConflictResolution">;

const PendingConflictResolutionScreen = () => {
  const { params } = useRoute<ScreenRouteProp>();
  const { existingEvent, pendingEvent } = params;
  const { user } = useContext(AuthContext)!;
  const navigation = useNavigation();

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Conflito de Eventos</Text>

      <Text style={styles.sectionTitle}>Evento Existente</Text>
      <Text>Nome: {existingEvent.name}</Text>
      <Text>Data: {existingEvent.day}</Text>
      <Text>Horário: {existingEvent.startTime} - {existingEvent.endTime}</Text>
      <Text>Tema: {existingEvent.theme}</Text>
      <Text>Público-alvo: {existingEvent.targetAudience}</Text>
      <Text>Modalidade: {existingEvent.mode}</Text>
      <Text>Ambiente: {existingEvent.environment}</Text>
      <Text>Organizador: {existingEvent.organizer}</Text>
      <Text>Recursos: {existingEvent.resourcesDescription?.join(", ")}</Text>
      <Text>Forma de Divulgação: {existingEvent.disclosureMethod}</Text>
      <Text>Disciplinas Relacionadas: {existingEvent.relatedSubjects?.join(", ")}</Text>
      <Text>Estratégia de Ensino: {existingEvent.teachingStrategy}</Text>
      <Text>Autores: {existingEvent.authors?.join(", ")}</Text>
      <Text>Cursos: {existingEvent.courses?.join(", ")}</Text>
      <Text>Vínculo Disciplinar: {existingEvent.disciplinaryLink}</Text>
      <Text>Local: {existingEvent.location?.name} ({existingEvent.location?.floor})</Text>
      <Text>Status: {existingEvent.status}</Text>
      <Text>Status Administrativo: {existingEvent.administrativeStatus}</Text>
       <Text>Prioridade: {existingEvent.priority}</Text>
      <Text>Duração da Limpeza: {existingEvent.cleanupDuration} minutos</Text>
      <Text>Observação: {existingEvent.observation}</Text>
      
      <Text style={styles.sectionTitle}>Evento Pendente</Text>
      <Text>Nome: {pendingEvent.name}</Text>
      <Text>Data: {pendingEvent.day}</Text>
      <Text>Horário: {pendingEvent.startTime} - {pendingEvent.endTime}</Text>
      <Text>Tema: {pendingEvent.theme}</Text>
      <Text>Público-alvo: {pendingEvent.targetAudience}</Text>
      <Text>Modalidade: {pendingEvent.mode}</Text>
      <Text>Ambiente: {pendingEvent.environment}</Text>
      <Text>Organizador: {pendingEvent.organizer}</Text>
      <Text>Recursos: {pendingEvent.resourcesDescription?.join(", ")}</Text>
      <Text>Forma de Divulgação: {pendingEvent.disclosureMethod}</Text>
      <Text>Disciplinas Relacionadas: {pendingEvent.relatedSubjects?.join(", ")}</Text>
      <Text>Estratégia de Ensino: {pendingEvent.teachingStrategy}</Text>
      <Text>Autores: {pendingEvent.authors?.join(", ")}</Text>
      <Text>Cursos: {pendingEvent.courses?.join(", ")}</Text>
      <Text>Vínculo Disciplinar: {pendingEvent.disciplinaryLink}</Text>
      <Text>Local: {pendingEvent.location?.name} ({pendingEvent.location?.floor})</Text>
      <Text>Status: {pendingEvent.status}</Text>
      <Text>Status Administrativo: {pendingEvent.administrativeStatus}</Text>
      <Text>Prioridade: {pendingEvent.priority}</Text>
      <Text>Duração da Limpeza: {pendingEvent.cleanupDuration} minutos</Text>
      <Text>Observação: {pendingEvent.observation}</Text>

      <TouchableOpacity
  style={styles.cancelButton}
  onPress={() => navigation.goBack()}
>
  <Text style={styles.cancelButtonText}>Cancelar</Text>
</TouchableOpacity>

      <TouchableOpacity style={styles.resolveButton} onPress={handleResolve}>
        <Text style={styles.resolveButtonText}>Aprovar Mesmo Assim</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PendingConflictResolutionScreen;
