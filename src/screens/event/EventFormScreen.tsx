import React, { useState, useContext } from "react";
import { Text, TextInput, Button, Alert, ScrollView, TouchableOpacity, Modal, View } from "react-native";
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

const locationOptionsByFloor: Record<string, string[]> = {
  "0": ["Auditório", "Sala Maker", "Hall Principal", "Sala T01", "Sala T02", "Sala T03"],
  "1": ["Sala de Informática 001", "Sala de Informática 002", "Sala de Informática 003", "Sala de Informática 004", "Sala 111", "Sala de Informática 001", "Sala de Aula 001", "Sala de Aula 002", "Sala de Aula 003", "Sala de Aula 004", "Sala de Aula 005", "Sala de Aula 006", "Sala de Aula 007", "Sala de Aula 008", "Sala de Aula 009"],
  "2": ["Sala de Informática 001", "Sala de Informática 002", "Sala de Informática 003", "Sala de Informática 004", "Sala de Aula 001", "Sala de Aula 002", "Sala de Aula 003", "Sala de Aula 004", "Sala de Aula 005", "Sala de Aula 006", "Sala de Aula 007", "Sala de Aula 008", "Sala de Aula 009", "Sala de Aula 010" ],
  "3": ["Sala de Aula 1", "Sala de Aula 2"],
};

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
    resourcesDescription: [""],
    disclosureMethod: "",
    relatedSubjects: [""],
    teachingStrategy: "",
    authors: [""],
    courses: [""],
    disciplinaryLink: "",
    locationName: "",
    locationFloor: "",
    status: "",
    administrativeStatus: "",
    priority: "",
    observation: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [cleanupHours, setCleanupHours] = useState("");
  const [cleanupMinutes, setCleanupMinutes] = useState("");
  

  const handleAuthorChange = (index: number, value: string) => {
    const updatedAuthors = [...eventData.authors];
    updatedAuthors[index] = value;
    setEventData(prev => ({ ...prev, authors: updatedAuthors }));
  };
  
  const addAuthorField = () => {
    setEventData(prev => ({ ...prev, authors: [...prev.authors, ""] }));
  };
  
  const removeAuthorField = (index: number) => {
    const updatedAuthors = [...eventData.authors];
    updatedAuthors.splice(index, 1);
    setEventData(prev => ({ ...prev, authors: updatedAuthors }));
  };
  
  const handleCourseChange = (index: number, value: string) => {
    const updatedCourses = [...eventData.courses];
    updatedCourses[index] = value;
    setEventData(prev => ({ ...prev, courses: updatedCourses }));
  };
  
  const addCourseField = () => {
    setEventData(prev => ({ ...prev, courses: [...prev.courses, ""] }));
  };
  
  const removeCourseField = (index: number) => {
    const updatedCourses = [...eventData.courses];
    updatedCourses.splice(index, 1);
    setEventData(prev => ({ ...prev, courses: updatedCourses }));
  };

  const handleResourcesDescriptionChange = (index: number, value: string) => {
    const updatedResourcesDescriptions = [...eventData.resourcesDescription];
    updatedResourcesDescriptions[index] = value;
    setEventData(prev => ({ ...prev, resourcesDescription: updatedResourcesDescriptions }));
  };
  
  const addResourcesDescriptionField = () => {
    setEventData(prev => ({ ...prev, resourcesDescription: [...prev.resourcesDescription, ""] }));
  };
  
  const removeResourcesDescriptionField = (index: number) => {
    const updatedResourcesDescriptions = [...eventData.resourcesDescription];
    updatedResourcesDescriptions.splice(index, 1);
    setEventData(prev => ({ ...prev, resourcesDescription: updatedResourcesDescriptions }));
  };  
  
  const handleRelatedSubjectChange = (index: number, value: string) => {
    const updatedRelatedSubjects = [...eventData.relatedSubjects];
    updatedRelatedSubjects[index] = value;
    setEventData(prev => ({ ...prev, relatedSubjects: updatedRelatedSubjects }));
  };
  
  const addRelatedSubjectField = () => {
    setEventData(prev => ({ ...prev, relatedSubjects: [...prev.relatedSubjects, ""] }));
  };
  
  const removeRelatedSubjectField = (index: number) => {
    const updatedRelatedSubjects = [...eventData.relatedSubjects];
    updatedRelatedSubjects.splice(index, 1);
    setEventData(prev => ({ ...prev, relatedSubjects: updatedRelatedSubjects }));
  };

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

      let cleanupDurationISO = "";
      if (cleanupHours || cleanupMinutes) {
        cleanupDurationISO = "PT";
        if (cleanupHours) cleanupDurationISO += `${parseInt(cleanupHours)}H`;
        if (cleanupMinutes) cleanupDurationISO += `${parseInt(cleanupMinutes)}M`;
      }

      const formattedData = {
        ...eventData,
        day: selectedDay ? selectedDay.toISOString().split("T")[0] : "",
        startTime: eventData.startTime + ":00",
        endTime: eventData.endTime + ":00",
        resourcesDescription: eventData.resourcesDescription,
        relatedSubjects: eventData.relatedSubjects,
        authors: eventData.authors,
        courses: eventData.courses,
        location: { name: eventData.locationName, floor: eventData.locationFloor },
        cleanupDuration: cleanupDurationISO || null,
      };
  
      const result = await createEvent(auth.user.token, formattedData);
   
      if (!result.conflict) {
        Alert.alert("Sucesso", "Evento criado com sucesso!");
        navigation.goBack();
        return;
      }
  
      const conflictingEvent = result.conflictData.existingEvent;
    
    navigation.navigate("ConflictResolution", {
      newEvent: formattedData,
      existingEvent: conflictingEvent,
    });
    
    } catch (error) {
      console.error(error);
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
  
      <Text style={styles.label}>Recursos:</Text>
        {eventData.resourcesDescription.map((resource, index) => (
          <React.Fragment key={index}>
            <TextInput
              style={styles.input}
              placeholder={`Recurso ${index + 1}`}
              value={resource}
              onChangeText={(text) => handleResourcesDescriptionChange(index, text)}
            />
            {index > 0 && (
              <Button
                title="Remover"
                color="red"
                onPress={() => removeResourcesDescriptionField(index)}
              />
            )}
          </React.Fragment>
        ))}
<TouchableOpacity style={styles.addButton} onPress={addResourcesDescriptionField}>
  <Text style={styles.addButtonText}>Adicionar Recurso</Text>
</TouchableOpacity>

      <Text style={styles.label}>Forma de Divulgação:</Text>
      <TextInput style={styles.input} placeholder="Forma de Divulgação" onChangeText={(text) => handleChange("disclosureMethod", text)} />
  
      <Text style={styles.label}>Disciplinas Relacionadas:</Text>
{eventData.relatedSubjects.map((relatedSubject, index) => (
  <React.Fragment key={index}>
    <TextInput
      style={styles.input}
      placeholder={`Disciplina ${index + 1}`}
      value={relatedSubject}
      onChangeText={(text) => handleRelatedSubjectChange(index, text)}
    />
    {index > 0 && (
      <Button
        title="Remover"
        color="red"
        onPress={() => removeRelatedSubjectField(index)}
      />
    )}
  </React.Fragment>
))}
<TouchableOpacity style={styles.addButton} onPress={addRelatedSubjectField}>
  <Text style={styles.addButtonText}>Adicionar Disciplina</Text>
</TouchableOpacity>

      <Text style={styles.label}>Estratégia de Ensino:</Text>
      <TextInput style={styles.input} placeholder="Estratégia de Ensino" onChangeText={(text) => handleChange("teachingStrategy", text)} />
  
      <Text style={styles.label}>Autores:</Text>
{eventData.authors.map((author, index) => (
  <React.Fragment key={index}>
    <TextInput
      style={styles.input}
      placeholder={`Autor ${index + 1}`}
      value={author}
      onChangeText={(text) => handleAuthorChange(index, text)}
    />
    {index > 0 && (
      <Button
        title="Remover"
        color="red"
        onPress={() => removeAuthorField(index)}
      />
    )}
  </React.Fragment>
))}
<TouchableOpacity style={styles.addButton} onPress={addAuthorField}>
  <Text style={styles.addButtonText}>Adicionar Autor</Text>
</TouchableOpacity>

<Text style={styles.label}>Cursos:</Text>
{eventData.courses.map((course, index) => (
  <React.Fragment key={index}>
    <TextInput
      style={styles.input}
      placeholder={`Curso ${index + 1}`}
      value={course}
      onChangeText={(text) => handleCourseChange(index, text)}
    />
    {index > 0 && (
      <Button
        title="Remover"
        color="red"
        onPress={() => removeCourseField(index)}
      />
    )}
  </React.Fragment>
))}
<TouchableOpacity style={styles.addButton} onPress={addCourseField}>
  <Text style={styles.addButtonText}>Adicionar Curso</Text>
</TouchableOpacity>

      <Text style={styles.label}>Vínculo Disciplinar:</Text>
      <TextInput style={styles.input} placeholder="Vínculo Disciplinar" onChangeText={(text) => handleChange("disciplinaryLink", text)} />
  
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

      <Text style={styles.label}>Local do Evento:</Text>
      <Picker
        selectedValue={eventData.locationName}
        onValueChange={(itemValue) => handleChange("locationName", itemValue)}
        style={styles.input}
        enabled={!!eventData.locationFloor && locationOptionsByFloor[eventData.locationFloor]?.length > 0}
      >
      <Picker.Item label="Selecione o local" value="" />
      {(locationOptionsByFloor[eventData.locationFloor] || []).map((location) => (
        <Picker.Item key={location} label={location} value={location} />
      ))}
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
    <Picker.Item label="Normal" value="NORMAL" />
    <Picker.Item label="Aprovado" value="APROVADO" />
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

      <Text style={styles.label}>Duração de Limpeza</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Horas"
            keyboardType="numeric"
            value={cleanupHours}
            onChangeText={setCleanupHours}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Minutos"
            keyboardType="numeric"
            value={cleanupMinutes}
            onChangeText={setCleanupMinutes}
          />
        </View>

      <Text style={styles.label}>Observação:</Text>
      <TextInput style={styles.input} placeholder="Observação" onChangeText={(text) => handleChange("observation", text)} />

      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Criar Evento</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default EventFormScreen;
