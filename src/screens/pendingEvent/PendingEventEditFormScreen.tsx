import React, { useState, useEffect, useContext } from "react";
import { Text, TextInput, Button, Alert, ScrollView } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getPendingEventById, updatePendingEvent } from "../../api/pendingEvent";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/PendingEventFormScreenStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = NativeStackScreenProps<RootStackParamList, "PendingEventEditForm">;

const PendingEventEditFormScreen = ({ navigation, route }: Props) => {
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

 const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [startTimeDate, setStartTimeDate] = useState<Date | null>(null);
  const [endTimeDate, setEndTimeDate] = useState<Date | null>(null);
  
    useEffect(() => {
      const fetchPendingEvent = async () => {
        if (!auth?.user) return;
  
        try {
          const event = await getPendingEventById(auth.user.token, eventId);
          setEventData({
            name: event.name,
            day: format(new Date(event.day), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
            startTime: format(new Date(`${event.day}T${event.startTime}`), "HH:mm"),
            endTime: format(new Date(`${event.day}T${event.endTime}`), "HH:mm"),
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
  
          setSelectedDay(new Date(event.day));
          setStartTimeDate(new Date(`${event.day}T${event.startTime}`));
          setEndTimeDate(new Date(`${event.day}T${event.endTime}`));
  
  
        } catch (error) {
          Alert.alert("Erro", "Erro ao carregar evento.");
        }
      };
  
      fetchPendingEvent();
    }, [auth, eventId]);

const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (!selectedDate) return;
    setSelectedDay(selectedDate);
    handleChange("day", format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }));
  };
  
  const handleStartTimeChange = (_: any, selectedDate?: Date) => {
    setShowStartTimePicker(false);
    if (!selectedDate) return;
    setStartTimeDate(selectedDate);
    handleChange("startTime", format(selectedDate, "HH:mm"));
  };
  
  const handleEndTimeChange = (_: any, selectedDate?: Date) => {
    setShowEndTimePicker(false);
    if (!selectedDate) return;
    setEndTimeDate(selectedDate);
    handleChange("endTime", format(selectedDate, "HH:mm"));
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
        startTime: startTimeDate ? format(startTimeDate, "HH:mm:ss") : eventData.startTime + ":00",
        endTime: endTimeDate ? format(endTimeDate, "HH:mm:ss") : eventData.endTime + ":00",        
        resourcesDescription: eventData.resourcesDescription.split(","),
        relatedSubjects: eventData.relatedSubjects.split(","),
        authors: eventData.authors.split(","),
        courses: eventData.courses.split(","),
        location: { name: eventData.locationName, floor: eventData.locationFloor },
        cleanupDuration: `PT${eventData.cleanupDuration}M`,
      };

      await updatePendingEvent(auth.user.token, eventId, formattedData);
      Alert.alert("Sucesso", "Evento Pendente atualizado!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Erro ao atualizar evento pendente.");
    }
  };



  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Editar Evento Pendente</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={eventData.name} placeholder="Nome" onChangeText={(text) => handleChange("name", text)} />

      <Text style={styles.label}>Data:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
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
      <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
        <Text style={styles.input}>{eventData.startTime || "Selecionar horário"}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          mode="time"
          display="default"
          value={startTimeDate ?? new Date()}
          onChange={handleStartTimeChange}
          is24Hour={true}
        />
      )}

      <Text style={styles.label}>Horário de Término:</Text>
      <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
        <Text style={styles.input}>{eventData.endTime || "Selecionar horário"}</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          mode="time"
          display="default"
          value={endTimeDate ?? new Date()}
          onChange={handleEndTimeChange}
          is24Hour={true}
        />
      )}

      <Text style={styles.label}>Tema:</Text>
      <TextInput style={styles.input} value={eventData.theme} placeholder="Tema" onChangeText={(text) => handleChange("theme", text)} />

      <Text style={styles.label}>Público-alvo:</Text>
      <TextInput style={styles.input} value={eventData.targetAudience} placeholder="Público-alvo" onChangeText={(text) => handleChange("targetAudience", text)} />

      <Text style={styles.label}>Modalidade:</Text>
      <Picker
        selectedValue={eventData.mode}
        onValueChange={(itemValue) => handleChange("mode", itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Presencial" value="PRESENCIAL" />
        <Picker.Item label="Online" value="ONLINE" />
        <Picker.Item label="Híbrido" value="HIBRIDO" />
      </Picker>

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
      <Picker
        selectedValue={eventData.locationFloor}
        onValueChange={(itemValue) => handleChange("locationFloor", itemValue)}
        style={styles.input}
      >
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
        <Picker.Item label="Planejado" value="PLANEJADO" />
        <Picker.Item label="Em Breve" value="EM_BREVE" />
        <Picker.Item label="Em Andamento" value="EM_ANDAMENTO" />
        <Picker.Item label="Em Pausa" value="EM_PAUSA" />
        <Picker.Item label="Urgente" value="URGENTE" />
        <Picker.Item label="Finalizado" value="FINALIZADO" />
        <Picker.Item label="Cancelado" value="CANCELADO" />
        <Picker.Item label="Adiado" value="ADIADO" />
        <Picker.Item label="Atrasado" value="ATRASADO" />
        <Picker.Item label="Indefinido" value="INDEFINIDO" />
        <Picker.Item label="Aprovado" value="APROVADO" />
        <Picker.Item label="Pendente" value="PENDENTE" />
      </Picker>

      <Text style={styles.label}>Prioridade:</Text>
      <Picker
        selectedValue={eventData.priority}
        onValueChange={(itemValue) => handleChange("priority", itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Muito Baixa" value="MUITO_BAIXA" />
        <Picker.Item label="Baixa" value="BAIXA" />
        <Picker.Item label="Média" value="MEDIA" />
        <Picker.Item label="Alta" value="ALTA" />
        <Picker.Item label="Crítica" value="CRITICA" />
      </Picker>
      
      <Text style={styles.label}>Duração da Limpeza (minutos):</Text>
      <TextInput style={styles.input} value={eventData.cleanupDuration} placeholder="Duração da Limpeza" onChangeText={(text) => handleChange("cleanupDuration", text)} />

      <Text style={styles.label}>Observação:</Text>
      <TextInput style={styles.input} value={eventData.observation} placeholder="Observação" onChangeText={(text) => handleChange("observation", text)} />

      <Button title="Salvar Alterações" onPress={handleSubmit} />
    </ScrollView>

  );
};

export default PendingEventEditFormScreen;
