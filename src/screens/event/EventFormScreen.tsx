import React, { useState, useContext } from "react";
import { Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../../contexts/AuthContext";
import { createEvent } from "../../api/event";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/EventFormScreenStyles";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Picker } from '@react-native-picker/picker';

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
    administrativeStatus: "",
    priority: "",
    cleanupDuration: "",
    observation: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (!selectedDate) return;
  
    setSelectedDay(selectedDate);
    setEventData((prev) => ({
      ...prev,
      day: format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    }));
  };
  
  const handleStartTimeChange = (_: any, selectedDate?: Date) => {
    setShowStartTimePicker(false);
    if (!selectedDate) return;
  
    setEventData((prev) => ({
      ...prev,
      startTime: format(selectedDate, "HH:mm"),
    }));
  };
 
  const handleEndTimeChange = (_: any, selectedDate?: Date) => {
    setShowEndTimePicker(false);
    if (!selectedDate) return;
  
    setEventData((prev) => ({
      ...prev,
      endTime: format(selectedDate, "HH:mm"),
    }));
  };  

  const showPicker = (type: "date" | "start" | "end") => {
    if (type === "date") setShowDatePicker(true);
    else if (type === "start") setShowStartTimePicker(true);
    else if (type === "end") setShowEndTimePicker(true);
  };

  const handleChange = (field: string, value: string) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!auth?.user) return;
  
    try {
      const formattedData = {
        ...eventData,
        day: selectedDay ? selectedDay.toISOString().split("T")[0] : "",
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
      <Text style={styles.label}>Data:</Text>
            <TouchableOpacity onPress={() => showPicker("date")}>
              <Text style={styles.input}>{eventData.day || "Selecionar data"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                display="default"
                value={selectedDay ?? new Date()}
                onChange={handleDateChange}
              />
            )}
            <Text style={styles.label}>Horário de Início:</Text>
            <TouchableOpacity onPress={() => showPicker("start")}>
              <Text style={styles.input}>{eventData.startTime || "Selecionar horário"}</Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                mode="time"
                display="default"
                value={new Date()}
                onChange={handleStartTimeChange}
                is24Hour={true}
              />
            )}
            <Text style={styles.label}>Horário de Término:</Text>
            <TouchableOpacity onPress={() => showPicker("end")}>
              <Text style={styles.input}>{eventData.endTime || "Selecionar horário"}</Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                mode="time"
                display="default"
                value={new Date()}
                onChange={handleEndTimeChange}
                is24Hour={true}
              />
            )}  
      <Text style={styles.label}>Tema:</Text>
      <TextInput style={styles.input} placeholder="Tema" onChangeText={(text) => handleChange("theme", text)} />
  
      <Text style={styles.label}>Público-alvo:</Text>
      <TextInput style={styles.input} placeholder="Público-alvo" onChangeText={(text) => handleChange("targetAudience", text)} />
  
      <Text style={styles.label}>Modalidade:</Text>
      <Picker
        selectedValue={eventData.mode}
        onValueChange={(itemValue) => handleChange("mode", itemValue)}
        style={styles.input}
      >
         <Picker.Item label="Selecione a modalidade" value="" />
        <Picker.Item label="Presencial" value="PRESENCIAL" />
        <Picker.Item label="Online" value="ONLINE" />
        <Picker.Item label="Híbrido" value="HIBRIDO" />
      </Picker>
      
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
      <Picker
        selectedValue={eventData.locationFloor}
        onValueChange={(itemValue) => handleChange("locationFloor", itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Selecione o andar" value="" />
        <Picker.Item label="Térreo" value="0" />
        <Picker.Item label="1º Andar" value="1" />
        <Picker.Item label="2º Andar" value="2" />
        <Picker.Item label="Bloco C" value="3" />
      </Picker>
      <Text style={styles.label}>Status:</Text>
<Picker
  selectedValue={eventData.status}
  onValueChange={(itemValue) => handleChange("status", itemValue)}
  style={styles.input}
>
  <Picker.Item label="Selecione o status" value="" />
  <Picker.Item label="Planejado" value="PLANEJADO" />
</Picker>

  
<Text style={styles.label}>Status Administrativo:</Text>
<Picker
  selectedValue={eventData.administrativeStatus}
  onValueChange={(itemValue) => handleChange("administrativeStatus", itemValue)}
  style={styles.input}
>
  <Picker.Item label="Selecione o status administrativo" value="" />
  <Picker.Item label="Pendente" value="PENDENTE" />
  <Picker.Item label="Cancelado" value="CANCELADO" />
  <Picker.Item label="Urgente" value="URGENTE" />
  <Picker.Item label="Adiado" value="ADIADO" />
  <Picker.Item label="Atrasado" value="ATRASADO" />
  <Picker.Item label="Indefinido" value="INDEFINIDO" />
</Picker>
      <Text style={styles.label}>Prioridade:</Text>
      <Picker
        selectedValue={eventData.priority}
        onValueChange={(itemValue) => handleChange("priority", itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Selecione a prioridade" value="" />
        <Picker.Item label="Muito Baixa" value="MUITO_BAIXA" />
        <Picker.Item label="Baixa" value="BAIXA" />
        <Picker.Item label="Média" value="MEDIA" />
        <Picker.Item label="Alta" value="ALTA" />
        <Picker.Item label="Crítica" value="CRITICA" />
      </Picker>

      <Text style={styles.label}>Duração da Limpeza (minutos):</Text>
      <TextInput style={styles.input} placeholder="Duração da Limpeza" onChangeText={(text) => handleChange("cleanupDuration", text)} />
  
      <Text style={styles.label}>Observação:</Text>
      <TextInput style={styles.input} placeholder="Observação" onChangeText={(text) => handleChange("observation", text)} />
  
      <Button title="Criar Evento" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default EventFormScreen;
