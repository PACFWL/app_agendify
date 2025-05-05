import React, { useContext } from "react";
import { View, Text, ScrollView, Button, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import { resolveEventConflict } from "../../api/event";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext"; 
import styles from "../../styles/ConflictResolutionScreenStyles";

type Props = NativeStackScreenProps<RootStackParamList, "ConflictResolution">;

const ConflictResolutionScreen = ({ route }: Props) => {
  const { newEvent, existingEvent } = route.params;
  const navigation = useNavigation();
  const auth = useContext(AuthContext); 

  const handleReplace = async () => {
    try {
      if (!auth?.user?.token) {
        throw new Error("Token de autenticação ausente.");
      }

      await resolveEventConflict(auth.user.token, existingEvent.id, newEvent); 
      Alert.alert("Evento substituído com sucesso!");
      navigation.goBack();
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro ao substituir o evento.");
    }
  };

  const renderEventDetails = (event: any) => (
    <>
      <Text>Nome: {event.name}</Text>
      <Text>Data: {event.day}</Text>
      <Text>Horário: {event.startTime} - {event.endTime}</Text>
      <Text>Tema: {event.theme}</Text>
      <Text>Público-alvo: {event.targetAudience}</Text>
      <Text>Modalidade: {event.mode}</Text>
      <Text>Ambiente: {event.environment}</Text>
      <Text>Organizador: {event.organizer}</Text>
      <Text>Recursos: {event.resourcesDescription?.join(", ")}</Text>
      <Text>Forma de Divulgação: {event.disclosureMethod}</Text>
      <Text>Disciplinas Relacionadas: {event.relatedSubjects?.join(", ")}</Text>
      <Text>Estratégia de Ensino: {event.teachingStrategy}</Text>
      <Text>Autores: {event.authors?.join(", ")}</Text>
      <Text>Cursos: {event.courses?.join(", ")}</Text>
      <Text>Vínculo Disciplinar: {event.disciplinaryLink}</Text>
      <Text>Local: {event.location?.name} ({event.location?.floor})</Text>
      <Text>Status: {event.status}</Text>
      <Text>Status Administrativo: {event.administrativeStatus}</Text>
      <Text>Prioridade: {event.priority}</Text>
      <Text>Duração da Limpeza: {event.cleanupDuration} minutos</Text>
      <Text>Observação: {event.observation}</Text>
    </>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.header}>Conflito de Eventos</Text>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Evento Existente:</Text>
        {renderEventDetails(existingEvent)}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Novo Evento:</Text>
        {renderEventDetails(newEvent)}
      </View>

      <View style={styles.buttonRow}>
        <Button title="Cancelar" onPress={() => navigation.goBack()} />
        <Button title="Substituir Evento Existente" onPress={handleReplace} />
      </View>
    </ScrollView>
  );
};

export default ConflictResolutionScreen;
