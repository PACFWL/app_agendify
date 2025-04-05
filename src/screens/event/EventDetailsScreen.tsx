import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, ActivityIndicator, Button, ScrollView, Alert } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { getEventById, deleteEvent } from "../../api/event";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/EventDetailsScreenStyles";

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
  priority: string;
  cleanupDuration: string;
  createdAt: string;
  lastModifiedAt: string;
};

const EventDetailsScreen = ({ route, navigation }: Props) => {
  const { eventId } = route.params;
  const auth = useContext(AuthContext);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchEvent = async () => {
        if (!auth?.user) return;
  
        try {
          const data = await getEventById(auth.user.token, eventId);
          setEvent(data);
        } catch (error) {
          Alert.alert("Erro", "Erro ao carregar detalhes do evento.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchEvent();
    }, [auth, eventId])
  );

  const handleDelete = async () => {
    if (!auth?.user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      await deleteEvent(auth.user.token, eventId);
      Alert.alert("Sucesso", "Evento deletado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Erro ao deletar evento.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Data:</Text> {event.day}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Horário:</Text> {event.startTime} - {event.endTime}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Tema:</Text> {event.theme}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Público-alvo:</Text> {event.targetAudience}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Modalidade:</Text> {event.mode}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Ambiente:</Text> {event.environment}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Organizador:</Text> {event.organizer}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Recursos:</Text> {event.resourcesDescription.join(", ")}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Divulgação:</Text> {event.disclosureMethod}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Assuntos Relacionados:</Text> {event.relatedSubjects.join(", ")}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Estratégia de Ensino:</Text> {event.teachingStrategy}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Autores:</Text> {event.authors.join(", ")}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Cursos:</Text> {event.courses.join(", ")}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Vínculo Disciplinar:</Text> {event.disciplinaryLink}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Localização:</Text> {event.location.name} - {event.location.floor}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Observação:</Text> {event.observation}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Status:</Text> {event.status}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Prioridade:</Text> {event.priority}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Duração da Limpeza:</Text> {event.cleanupDuration}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Criado em:</Text> {new Date(event.createdAt).toLocaleString()}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Última Modificação:</Text> {new Date(event.lastModifiedAt).toLocaleString()}</Text>
      
      <View style={styles.buttonContainer}>
  <Button title="Editar Evento" onPress={() => navigation.navigate("EventEditForm", { eventId })} color="orange" />
  <Button title="Voltar" onPress={() => navigation.goBack()} color="#6200ee" />
  <Button title="Deletar Evento" onPress={handleDelete} color="red" />
</View>
    </ScrollView>
  );
};

export default EventDetailsScreen;
