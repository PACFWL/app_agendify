import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getEventById, updateEvent } from "../../api/event";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/EventFormScreenStyles";

type Props = NativeStackScreenProps<RootStackParamList, "EventEditForm">;

const EventEditFormScreen = ({ route, navigation }: Props) => {
  const { eventId } = route.params;
  const auth = useContext(AuthContext);

  const [eventData, setEventData] = useState({
    name: "",
    day: "",
    startTime: "",
    endTime: "",
    theme: "",
    targetAudience: "",
    mode: "",
    environment: "",
    organizer: "",
    resourcesDescription: "",
    disclosureMethod: "",
    relatedSubjects: "",
    teachingStrategy: "",
    authors: "",
    courses: "",
    disciplinaryLink: "",
    locationName: "",
    locationFloor: "",
    status: "",
    priority: "",
    cleanupDuration: "",
    observation: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!auth?.user) return;

      try {
        const event = await getEventById(auth.user.token, eventId);
        setEventData({
          name: event.name,
          day: event.day,
          startTime: event.startTime.slice(0, 5),
          endTime: event.endTime.slice(0, 5),
          theme: event.theme,
          targetAudience: event.targetAudience,
          mode: event.mode,
          environment: event.environment,
          organizer: event.organizer,
          resourcesDescription: event.resourcesDescription.join(", "),
          disclosureMethod: event.disclosureMethod,
          relatedSubjects: event.relatedSubjects.join(", "),
          teachingStrategy: event.teachingStrategy,
          authors: event.authors.join(", "),
          courses: event.courses.join(", "),
          disciplinaryLink: event.disciplinaryLink,
          locationName: event.location.name,
          locationFloor: event.location.floor,
          status: event.status,
          priority: event.priority,
          cleanupDuration: event.cleanupDuration.replace("PT", "").replace("M", ""),
          observation: event.observation,
        });
      } catch (error) {
        Alert.alert("Erro", "Erro ao carregar evento.");
      }
    };

    fetchEvent();
  }, [auth, eventId]);

  const handleChange = (field: string, value: string) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!auth?.user) return;

    try {
      const formattedData = {
        ...eventData,
        day: new Date(eventData.day).toISOString().split("T")[0],
        startTime: eventData.startTime + ":00",
        endTime: eventData.endTime + ":00",
        resourcesDescription: eventData.resourcesDescription.split(","),
        relatedSubjects: eventData.relatedSubjects.split(","),
        authors: eventData.authors.split(","),
        courses: eventData.courses.split(","),
        location: { name: eventData.locationName, floor: eventData.locationFloor },
        cleanupDuration: `PT${eventData.cleanupDuration}M`,
      };

      await updateEvent(auth.user.token, eventId, formattedData);
      Alert.alert("Sucesso", "Evento atualizado!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Erro ao atualizar evento.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Editar Evento</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={eventData.name} placeholder="Nome" onChangeText={(text) => handleChange("name", text)} />

      <Text style={styles.label}>Data (YYYY-MM-DD):</Text>
      <TextInput style={styles.input} value={eventData.day} placeholder="Data" onChangeText={(text) => handleChange("day", text)} />

      <Text style={styles.label}>Horário de Início (HH:MM):</Text>
      <TextInput style={styles.input} value={eventData.startTime} placeholder="Horário de Início" onChangeText={(text) => handleChange("startTime", text)} />

      <Text style={styles.label}>Horário de Término (HH:MM):</Text>
      <TextInput style={styles.input} value={eventData.endTime} placeholder="Horário de Término" onChangeText={(text) => handleChange("endTime", text)} />

      <Text style={styles.label}>Tema:</Text>
      <TextInput style={styles.input} value={eventData.theme} placeholder="Tema" onChangeText={(text) => handleChange("theme", text)} />

      <Text style={styles.label}>Público-alvo:</Text>
      <TextInput style={styles.input} value={eventData.targetAudience} placeholder="Público-alvo" onChangeText={(text) => handleChange("targetAudience", text)} />

      <Text style={styles.label}>Modalidade:</Text>
      <TextInput style={styles.input} value={eventData.mode} placeholder="Modalidade" onChangeText={(text) => handleChange("mode", text)} />

      <Text style={styles.label}>Ambiente:</Text>
      <TextInput style={styles.input} value={eventData.environment} placeholder="Ambiente" onChangeText={(text) => handleChange("environment", text)} />

      <Text style={styles.label}>Organizador:</Text>
      <TextInput style={styles.input} value={eventData.organizer} placeholder="Organizador" onChangeText={(text) => handleChange("organizer", text)} />

      <Text style={styles.label}>Recursos (separados por vírgula):</Text>
      <TextInput style={styles.input} value={eventData.resourcesDescription} placeholder="Recursos" onChangeText={(text) => handleChange("resourcesDescription", text)} />

      <Text style={styles.label}>Forma de Divulgação:</Text>
      <TextInput style={styles.input} value={eventData.disclosureMethod} placeholder="Forma de Divulgação" onChangeText={(text) => handleChange("disclosureMethod", text)} />

      <Text style={styles.label}>Disciplinas Relacionadas (separadas por vírgula):</Text>
      <TextInput style={styles.input} value={eventData.relatedSubjects} placeholder="Disciplinas" onChangeText={(text) => handleChange("relatedSubjects", text)} />

      <Text style={styles.label}>Estratégia de Ensino:</Text>
      <TextInput style={styles.input} value={eventData.teachingStrategy} placeholder="Estratégia de Ensino" onChangeText={(text) => handleChange("teachingStrategy", text)} />

      <Text style={styles.label}>Autores (separados por vírgula):</Text>
      <TextInput style={styles.input} value={eventData.authors} placeholder="Autores" onChangeText={(text) => handleChange("authors", text)} />

      <Text style={styles.label}>Cursos (separados por vírgula):</Text>
      <TextInput style={styles.input} value={eventData.courses} placeholder="Cursos" onChangeText={(text) => handleChange("courses", text)} />

      <Text style={styles.label}>Vínculo Disciplinar:</Text>
      <TextInput style={styles.input} value={eventData.disciplinaryLink} placeholder="Vínculo Disciplinar" onChangeText={(text) => handleChange("disciplinaryLink", text)} />

      <Text style={styles.label}>Local do Evento:</Text>
      <TextInput style={styles.input} value={eventData.locationName} placeholder="Local" onChangeText={(text) => handleChange("locationName", text)} />

      <Text style={styles.label}>Andar do Local:</Text>
      <TextInput style={styles.input} value={eventData.locationFloor} placeholder="Andar" onChangeText={(text) => handleChange("locationFloor", text)} />

      <Text style={styles.label}>Status do Evento:</Text>
      <TextInput style={styles.input} value={eventData.status} placeholder="Status" onChangeText={(text) => handleChange("status", text)} />

      <Text style={styles.label}>Prioridade:</Text>
      <TextInput style={styles.input} value={eventData.priority} placeholder="Prioridade" onChangeText={(text) => handleChange("priority", text)} />

      <Text style={styles.label}>Duração da Limpeza (minutos):</Text>
      <TextInput style={styles.input} value={eventData.cleanupDuration} placeholder="Duração da Limpeza" onChangeText={(text) => handleChange("cleanupDuration", text)} />

      <Text style={styles.label}>Observação:</Text>
      <TextInput style={styles.input} value={eventData.observation} placeholder="Observação" onChangeText={(text) => handleChange("observation", text)} />

      <Button title="Salvar Alterações" onPress={handleSubmit} />
    </ScrollView>

  );
};

export default EventEditFormScreen;
