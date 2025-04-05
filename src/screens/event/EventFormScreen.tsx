import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { createEvent } from "../../api/event";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/EventFormScreenStyles";

type Props = NativeStackScreenProps<RootStackParamList, "EventForm">;

const EventFormScreen = ({ navigation }: Props) => {
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

      await createEvent(auth.user.token, formattedData);
      Alert.alert("Sucesso", "Evento criado com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar evento.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>

      <Text style={styles.title}>Criar Novo Evento</Text>
  
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} placeholder="Nome" onChangeText={(text) => handleChange("name", text)} />
  
      <Text style={styles.label}>Data (YYYY-MM-DD):</Text>
      <TextInput style={styles.input} placeholder="Data" onChangeText={(text) => handleChange("day", text)} />
  
      <Text style={styles.label}>Horário de Início (HH:MM):</Text>
      <TextInput style={styles.input} placeholder="Horário de Início" onChangeText={(text) => handleChange("startTime", text)} />
  
      <Text style={styles.label}>Horário de Término (HH:MM):</Text>
      <TextInput style={styles.input} placeholder="Horário de Término" onChangeText={(text) => handleChange("endTime", text)} />
  
      <Text style={styles.label}>Tema:</Text>
      <TextInput style={styles.input} placeholder="Tema" onChangeText={(text) => handleChange("theme", text)} />
  
      <Text style={styles.label}>Público-alvo:</Text>
      <TextInput style={styles.input} placeholder="Público-alvo" onChangeText={(text) => handleChange("targetAudience", text)} />
  
      <Text style={styles.label}>Modalidade:</Text>
      <TextInput style={styles.input} placeholder="Modalidade" onChangeText={(text) => handleChange("mode", text)} />
  
      <Text style={styles.label}>Ambiente:</Text>
      <TextInput style={styles.input} placeholder="Ambiente" onChangeText={(text) => handleChange("environment", text)} />
  
      <Text style={styles.label}>Organizador:</Text>
      <TextInput style={styles.input} placeholder="Organizador" onChangeText={(text) => handleChange("organizer", text)} />
  
      <Text style={styles.label}>Recursos (separados por vírgula):</Text>
      <TextInput style={styles.input} placeholder="Recursos" onChangeText={(text) => handleChange("resourcesDescription", text)} />
  
      <Text style={styles.label}>Forma de Divulgação:</Text>
      <TextInput style={styles.input} placeholder="Forma de Divulgação" onChangeText={(text) => handleChange("disclosureMethod", text)} />
  
      <Text style={styles.label}>Disciplinas Relacionadas (separadas por vírgula):</Text>
      <TextInput style={styles.input} placeholder="Disciplinas" onChangeText={(text) => handleChange("relatedSubjects", text)} />
  
      <Text style={styles.label}>Estratégia de Ensino:</Text>
      <TextInput style={styles.input} placeholder="Estratégia de Ensino" onChangeText={(text) => handleChange("teachingStrategy", text)} />
  
      <Text style={styles.label}>Autores (separados por vírgula):</Text>
      <TextInput style={styles.input} placeholder="Autores" onChangeText={(text) => handleChange("authors", text)} />
  
      <Text style={styles.label}>Cursos (separados por vírgula):</Text>
      <TextInput style={styles.input} placeholder="Cursos" onChangeText={(text) => handleChange("courses", text)} />
  
      <Text style={styles.label}>Vínculo Disciplinar:</Text>
      <TextInput style={styles.input} placeholder="Vínculo Disciplinar" onChangeText={(text) => handleChange("disciplinaryLink", text)} />
  
      <Text style={styles.label}>Local do Evento:</Text>
      <TextInput style={styles.input} placeholder="Local" onChangeText={(text) => handleChange("locationName", text)} />
  
      <Text style={styles.label}>Andar do Local:</Text>
      <TextInput style={styles.input} placeholder="Andar" onChangeText={(text) => handleChange("locationFloor", text)} />
  
      <Text style={styles.label}>Status do Evento:</Text>
      <TextInput style={styles.input} placeholder="Status" onChangeText={(text) => handleChange("status", text)} />
  
      <Text style={styles.label}>Prioridade:</Text>
      <TextInput style={styles.input} placeholder="Prioridade" onChangeText={(text) => handleChange("priority", text)} />
  
      <Text style={styles.label}>Duração da Limpeza (minutos):</Text>
      <TextInput style={styles.input} placeholder="Duração da Limpeza" onChangeText={(text) => handleChange("cleanupDuration", text)} />
  
      <Text style={styles.label}>Observação:</Text>
      <TextInput style={styles.input} placeholder="Observação" onChangeText={(text) => handleChange("observation", text)} />
  
      <Button title="Criar Evento" onPress={handleSubmit} />
    </ScrollView>
  );
  
};

export default EventFormScreen;
