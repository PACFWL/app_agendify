import React,{useContext} from "react";
import { View, Text, Button, ScrollView, Alert,StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { resolveUpdateConflict } from "../../api/event"; 
import { AuthContext } from "../../contexts/AuthContext"; 
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/UpdateConflictResolutionScreenStyles";

type Props = NativeStackScreenProps<RootStackParamList, "UpdateConflictResolution">;

const UpdateConflictResolutionScreen = ({ route }: Props) => {
  const { updatedEvent, conflictingEvent } = route.params;
  const navigation = useNavigation();
  const auth  = useContext(AuthContext);


  const handleResolve = async () => {
    try {
    if (!auth?.user?.token) {
        throw new Error("Token de autenticação ausente.");
    }

      await resolveUpdateConflict(auth.user.token, conflictingEvent.id, updatedEvent, );
      Alert.alert("Sucesso", "Conflito resolvido e evento atualizado.");
      navigation.goBack();
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao resolver o conflito.");
    }
  };

  const renderEventDetails = (event: any) => (
    <>
     <View style={styles.detailCard}>
      <Text style={styles.detail}><Text>Nome: {event.name}</Text></Text>
      <Text style={styles.detail}><Text>Data: {event.day}</Text></Text>
      <Text style={styles.detail}><Text>Horário: {event.startTime} - {event.endTime}</Text></Text>
      <Text style={styles.detail}><Text>Tema: {event.theme}</Text></Text>
      <Text style={styles.detail}><Text>Público-alvo: {event.targetAudience}</Text></Text>
      <Text style={styles.detail}><Text>Modalidade: {event.mode}</Text></Text>
      <Text style={styles.detail}><Text>Ambiente: {event.environment}</Text></Text>
      <Text style={styles.detail}><Text>Organizador: {event.organizer}</Text></Text>
      <Text style={styles.detail}><Text>Recursos: {event.resourcesDescription?.join(", ")}</Text></Text>
      <Text style={styles.detail}><Text>Forma de Divulgação: {event.disclosureMethod}</Text></Text>
      <Text style={styles.detail}><Text>Disciplinas Relacionadas: {event.relatedSubjects?.join(", ")}</Text></Text>
      <Text style={styles.detail}><Text>Estratégia de Ensino: {event.teachingStrategy}</Text></Text>
      <Text style={styles.detail}><Text>Autores: {event.authors?.join(", ")}</Text></Text>
      <Text style={styles.detail}><Text>Cursos: {event.courses?.join(", ")}</Text></Text>
      <Text style={styles.detail}><Text>Vínculo Disciplinar: {event.disciplinaryLink}</Text></Text>
      <Text style={styles.detail}><Text>Local: {event.location?.name} ({event.location?.floor})</Text></Text>
      <Text style={styles.detail}><Text>Status: {event.status}</Text></Text>
      <Text style={styles.detail}><Text>Status Administrativo: {event.administrativeStatus}</Text></Text>
      <Text style={styles.detail}><Text>Prioridade: {event.priority}</Text></Text>
      <Text style={styles.detail}><Text>Duração da Limpeza: {event.cleanupDuration} minutos</Text></Text>
      <Text style={styles.detail}><Text>Observação: {event.observation}</Text></Text>
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.header}>Conflito de Atualização</Text>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Evento Existente:</Text>
        {renderEventDetails(conflictingEvent)}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Sua Atualização:</Text>
        {renderEventDetails(updatedEvent)}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={handleResolve}>
           <Text style={styles.buttonText}>Substituir Evento Existente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UpdateConflictResolutionScreen;