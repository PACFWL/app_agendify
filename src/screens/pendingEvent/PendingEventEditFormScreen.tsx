import React, { useEffect, useContext } from "react";
import { Text, TextInput, Alert, ScrollView, View } from "react-native";
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
import { usePendingEventEditForm } from "../../hooks/usePendingEventEditForm";

type Props = NativeStackScreenProps<RootStackParamList, "PendingEventEditForm">;

const locationOptionsByFloor: Record<string, string[]> = {
  "0": ["Auditório", "Sala Maker", "Hall Principal", "Sala T01", "Sala T02", "Sala T03"],
  "1": ["Sala de Informática 001", "Sala de Informática 002", "Sala de Informática 003", "Sala de Informática 004", "Sala 111", "Sala de Informática 001", "Sala de Aula 001", "Sala de Aula 002", "Sala de Aula 003", "Sala de Aula 004", "Sala de Aula 005", "Sala de Aula 006", "Sala de Aula 007", "Sala de Aula 008", "Sala de Aula 009"],
  "2": ["Sala de Informática 001", "Sala de Informática 002", "Sala de Informática 003", "Sala de Informática 004", "Sala de Aula 001", "Sala de Aula 002", "Sala de Aula 003", "Sala de Aula 004", "Sala de Aula 005", "Sala de Aula 006", "Sala de Aula 007", "Sala de Aula 008", "Sala de Aula 009", "Sala de Aula 010" ],
  "3": ["Sala de Aula 1", "Sala de Aula 2"],
};

const PendingEventEditFormScreen = ({ navigation, route }: Props) => {
    const { eventId } = route.params;
    const auth = useContext(AuthContext);

  const {
    handleAuthorChange,
    addAuthorField,
    removeAuthorField,
    handleCourseChange,
    addCourseField,
    removeCourseField,
    handleResourcesDescriptionChange,
    addResourcesDescriptionField,
    removeResourcesDescriptionField,
    handleRelatedSubjectChange,
    addRelatedSubjectField,
    removeRelatedSubjectField,
    eventData,
    setEventData,
    selectedDay,
    setSelectedDay,
    cleanupHours,
    setCleanupHours,
    cleanupMinutes,
    setCleanupMinutes,
    showDatePicker,
    setShowDatePicker,
    showStartTimePicker,
    setShowStartTimePicker,
    showEndTimePicker,
    setShowEndTimePicker,
    startTimeDate, 
    setStartTimeDate,
    endTimeDate, 
    setEndTimeDate,
    handleChange,
    handleDateChange,
    handleStartTimeChange,
    handleEndTimeChange
  } = usePendingEventEditForm();

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
            resourcesDescription: event.resourcesDescription,
            disclosureMethod: event.disclosureMethod,
            relatedSubjects: event.relatedSubjects,
            teachingStrategy: event.teachingStrategy,
            authors: event.authors,
            courses: event.courses,
            disciplinaryLink: event.disciplinaryLink,
            locationName: event.location.name,
            locationFloor: event.location.floor,
            status: event.status,
            administrativeStatus: event.administrativeStatus,
            priority: event.priority,
            cleanupDuration: event.cleanupDuration.replace("PT", "").replace("M", ""),
            observation: event.observation,
          });
  
          const cleanup = event.cleanupDuration.replace("PT", "");
          const hoursMatch = cleanup.match(/(\d+)H/);
          const minutesMatch = cleanup.match(/(\d+)M/);
          setCleanupHours(hoursMatch ? hoursMatch[1] : "");
          setCleanupMinutes(minutesMatch ? minutesMatch[1] : "");

          setSelectedDay(new Date(event.day));
          setStartTimeDate(new Date(`${event.day}T${event.startTime}`));
          setEndTimeDate(new Date(`${event.day}T${event.endTime}`));
  
  
        } catch (error) {
          Alert.alert("Erro", "Erro ao carregar evento.");
        }
      };
  
      fetchPendingEvent();
    }, [auth, eventId]);

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
        startTime: startTimeDate ? format(startTimeDate, "HH:mm:ss") : eventData.startTime + ":00",
        endTime: endTimeDate ? format(endTimeDate, "HH:mm:ss") : eventData.endTime + ":00",        
        resourcesDescription: eventData.resourcesDescription,
        relatedSubjects: eventData.relatedSubjects,
        authors: eventData.authors,
        courses: eventData.courses,
        location: { name: eventData.locationName, floor: eventData.locationFloor },
        cleanupDuration: cleanupDurationISO || null,
      };

      await updatePendingEvent(auth.user.token, eventId, formattedData);
      Alert.alert("Sucesso", "Evento Pendente atualizado!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Erro ao atualizar evento pendente.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
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

              <TouchableOpacity style={styles.removeButton}   onPress={() => removeResourcesDescriptionField(index)}>
                  <Text style={styles.addButtonText}>Remover</Text>
              </TouchableOpacity>
            )}
          </React.Fragment>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addResourcesDescriptionField}>
          <Text style={styles.addButtonText}>Adicionar Recurso</Text>
        </TouchableOpacity>

      <Text style={styles.label}>Forma de Divulgação:</Text>
      <TextInput style={styles.input} value={eventData.disclosureMethod} placeholder="Forma de Divulgação" onChangeText={(text) => handleChange("disclosureMethod", text)} />

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
        
            <TouchableOpacity style={styles.removeButton}     onPress={() => removeRelatedSubjectField(index)}>
                <Text style={styles.addButtonText}>Remover</Text>
            </TouchableOpacity>

          )}
        </React.Fragment>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addRelatedSubjectField}>
        <Text style={styles.addButtonText}>Adicionar Disciplina</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Estratégia de Ensino:</Text>
      <TextInput style={styles.input} value={eventData.teachingStrategy} placeholder="Estratégia de Ensino" onChangeText={(text) => handleChange("teachingStrategy", text)} />

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
            
              <TouchableOpacity style={styles.removeButton}    onPress={() => removeAuthorField(index)}>
                  <Text style={styles.addButtonText}>Remover</Text>
              </TouchableOpacity>

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
          
              <TouchableOpacity style={styles.removeButton} onPress={() => removeCourseField(index)}>
                  <Text style={styles.addButtonText}>Remover</Text>
              </TouchableOpacity>
              
            )}
          </React.Fragment>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addCourseField}>
          <Text style={styles.addButtonText}>Adicionar Curso</Text>
        </TouchableOpacity>

      <Text style={styles.label}>Vínculo Disciplinar:</Text>
      <TextInput style={styles.input} value={eventData.disciplinaryLink} placeholder="Vínculo Disciplinar" onChangeText={(text) => handleChange("disciplinaryLink", text)} />

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

         <Text style={styles.label}>Status do Evento:</Text>
      <Picker
        selectedValue={eventData.status}
        onValueChange={(itemValue) => handleChange("status", itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Em Análise" value="EM_ANALISE" />
        <Picker.Item label="Indeterminado" value="INDETERMINADO" />
      </Picker>

      <Text style={styles.label}>Status Administrativo:</Text>
      <Picker
        selectedValue={eventData.administrativeStatus}
        onValueChange={(itemValue) => handleChange("administrativeStatus", itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Aguardando" value="AGUARDANDO" />
      </Picker>

      <Text style={styles.label}>Prioridade:</Text>
      <Picker
        selectedValue={eventData.priority}
        onValueChange={(itemValue) => handleChange("priority", itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Indefinido" value="INDEFINIDO" />
        <Picker.Item label="Muito Baixa" value="MUITO_BAIXA" />
        <Picker.Item label="Baixa" value="BAIXA" />
        <Picker.Item label="Média" value="MEDIA" />
        <Picker.Item label="Alta" value="ALTA" />
        <Picker.Item label="Crítica" value="CRITICA" />
      </Picker>
      
      <Text style={styles.label}>Duração da Limpeza</Text>
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
      <TextInput style={styles.input} value={eventData.observation} placeholder="Observação" onChangeText={(text) => handleChange("observation", text)} />
     
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
      
    </ScrollView>

  );
};

export default PendingEventEditFormScreen;
