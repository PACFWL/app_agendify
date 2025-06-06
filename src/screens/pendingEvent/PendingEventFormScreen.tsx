import React, { useContext } from "react";
import { Text, TextInput, Button, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../../contexts/AuthContext";
import { createPendingEvent } from "../../api/pendingEvent";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/EventFormScreenStyles";
import { Picker } from '@react-native-picker/picker';
import { usePendingEventForm } from "../../hooks/usePendingEventForm";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getColors } from "../../styles/ThemeColors";


type Props = NativeStackScreenProps<RootStackParamList, "PendingEventForm">;

const locationOptionsByFloor: Record<string, string[]> = {
  "0": ["Auditório", "Sala Maker", "Hall Principal", "Sala T01", "Sala T02", "Sala T03"],
  "1": ["Sala de Informática 001", "Sala de Informática 002", "Sala de Informática 003", "Sala de Informática 004", "Sala 111", "Sala de Informática 001", "Sala de Aula 001", "Sala de Aula 002", "Sala de Aula 003", "Sala de Aula 004", "Sala de Aula 005", "Sala de Aula 006", "Sala de Aula 007", "Sala de Aula 008", "Sala de Aula 009"],
  "2": ["Sala de Informática 001", "Sala de Informática 002", "Sala de Informática 003", "Sala de Informática 004", "Sala de Aula 001", "Sala de Aula 002", "Sala de Aula 003", "Sala de Aula 004", "Sala de Aula 005", "Sala de Aula 006", "Sala de Aula 007", "Sala de Aula 008", "Sala de Aula 009", "Sala de Aula 010" ],
  "3": ["Sala de Aula 1", "Sala de Aula 2"],
};

const PendingEventFormScreen = ({ navigation }: Props) => {
  const auth = useContext(AuthContext);
const { theme } = useContext(ThemeContext);
  const colors = getColors(theme);
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
    showPicker,
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
    handleChange,
    handleDateChange,
    handleStartTimeChange,
    handleEndTimeChange
  } = usePendingEventForm();


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
        eventRequesterId: auth.user.id,
      };

      await createPendingEvent(auth.user.token, formattedData);
      Alert.alert("Sucesso", "Evento pendente criado com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar evento pendente.");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={[styles.title, { color: colors.primary }]}>Criar Evento Pendente</Text>

      <Text style={[styles.label, { color: colors.text }]}>Nome:</Text>
      <TextInput 
      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]} value={eventData.name} 
      placeholder="Nome" 
      placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
      onChangeText={(text) => handleChange("name", text)} />

      <Text style={[styles.label, { color: colors.text }]}>Data:</Text>
      <TouchableOpacity onPress={() => showPicker("date")}>
        <Text style={[styles.input, { color: colors.text }, { backgroundColor: colors.card, borderColor: colors.accent }]}>{eventData.day || "Selecionar data"}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          display="default"
          value={selectedDay ?? new Date()}
          onChange={handleDateChange}
        />
      )}

      <Text style={[styles.label, { color: colors.text }]}>Horário de Início:</Text>
      <TouchableOpacity onPress={() => showPicker("start")}>
        <Text style={[styles.input, { color: colors.text }, { backgroundColor: colors.card, borderColor: colors.accent }]}>{eventData.startTime || "Selecionar horário"}</Text>
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

      <Text style={[styles.label, { color: colors.text }]}>Horário de Término:</Text>
      <TouchableOpacity onPress={() => showPicker("end")}>
        <Text style={[styles.input, { color: colors.text }, { backgroundColor: colors.card, borderColor: colors.accent }]}>{eventData.endTime || "Selecionar horário"}</Text>
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

      <Text style={[styles.label, { color: colors.text }]}>Tema:</Text>
      <TextInput 
      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]} 
      placeholder="Tema" 
      placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
      onChangeText={(text) => 
      handleChange("theme", text)} />

      <Text style={[styles.label, { color: colors.text }]}>Público-alvo:</Text>
      <TextInput 
      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]} 
      placeholder="Público-alvo" 
      placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
      onChangeText={(text) => 
      handleChange("targetAudience", text)} />

      <Text style={[styles.label, { color: colors.text }]}>Modalidade:</Text>
      <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>
      <Picker
        selectedValue={eventData.mode}
        style={[styles.picker, { color: colors.text }]}
        onValueChange={(itemValue) => handleChange("mode", itemValue)}
      >
        <Picker.Item label="Selecione a modalidade" value="" />
          <Picker.Item label="Presencial" value="PRESENCIAL" />
          <Picker.Item label="Online" value="ONLINE" />
          <Picker.Item label="Híbrido" value="HIBRIDO" />
      </Picker>
</View>
      <Text style={[styles.label, { color: colors.text }]}>Ambiente:</Text>
      <TextInput
      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]}  
      placeholder="Ambiente" 
      placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
      onChangeText={(text) => 
      handleChange("environment", text)} />

      <Text style={[styles.label, { color: colors.text }]}>Organizador:</Text>
      <TextInput 
      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]}   
      placeholder="Organizador" 
      placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
      onChangeText={(text) => handleChange("organizer", text)} />

      <Text style={[styles.label, { color: colors.text }]}>Recursos:</Text>
      {eventData.resourcesDescription.map((resource, index) => (
        <React.Fragment key={index}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]}
            placeholder={`Recurso ${index + 1}`}
            placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
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

      <Text style={[styles.label, { color: colors.text }]}>Forma de Divulgação:</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]}
       placeholder="Forma de Divulgação" 
       placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
       onChangeText={(text) => handleChange("disclosureMethod", text)} />

      <Text style={[styles.label, { color: colors.text }]}>Disciplinas Relacionadas:</Text>
      {eventData.relatedSubjects.map((relatedSubject, index) => (
        <React.Fragment key={index}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]}
            placeholder={`Disciplina ${index + 1}`}
            placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
            value={relatedSubject}
            onChangeText={(text) => handleRelatedSubjectChange(index, text)}
          />
          {index > 0 && (

        <TouchableOpacity style={styles.removeButton}   onPress={() => removeRelatedSubjectField(index)}>
                <Text style={styles.addButtonText}>Remover</Text>
            </TouchableOpacity>
            
          )}
        </React.Fragment>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addRelatedSubjectField}>
        <Text style={styles.addButtonText}>Adicionar Disciplina</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { color: colors.text }]}>Estratégia de Ensino:</Text>
      <TextInput 
      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]} 
      placeholder="Estratégia de Ensino" 
      placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
      onChangeText={(text) => 
      handleChange("teachingStrategy", text)} />

      <Text style={[styles.label, { color: colors.text }]}>Autores:</Text>
        {eventData.authors.map((author, index) => (
          <React.Fragment key={index}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]}
              placeholder={`Autor ${index + 1}`}
              placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
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

        <Text style={[styles.label, { color: colors.text }]}>Cursos:</Text>
        {eventData.courses.map((course, index) => (
          <React.Fragment key={index}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]}
              placeholder={`Curso ${index + 1}`}
              placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
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

    <Text style={[styles.label, { color: colors.text }]}>Vínculo Disciplinar:</Text>
      <TextInput 
      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]}    
      placeholder="Vínculo Disciplinar" 
      placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
      onChangeText={(text) => 
      handleChange("disciplinaryLink", text)} />
  
      <Text style={[styles.label, { color: colors.text }]}>Andar do Local:</Text>
        <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>
      <Picker
        selectedValue={eventData.locationFloor}
        onValueChange={(itemValue) => handleChange("locationFloor", itemValue)}
        style={[styles.picker, { color: colors.text }]}
        dropdownIconColor={colors.text}
      >
        <Picker.Item label="Selecione o andar" value="" />
        <Picker.Item label="Térreo" value="0" />
        <Picker.Item label="1º Andar" value="1" />
        <Picker.Item label="2º Andar" value="2" />
        <Picker.Item label="Bloco C" value="3" />
      </Picker>
</View>
      <Text style={[styles.label, { color: colors.text }]}>Local do Evento:</Text>
      <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>
      <Picker
      selectedValue={eventData.locationName}
      onValueChange={(itemValue) => handleChange("locationName", itemValue)}
       style={[styles.picker, { color: colors.text }]}
        dropdownIconColor={colors.text}
      enabled={!!eventData.locationFloor && locationOptionsByFloor[eventData.locationFloor]?.length > 0}
    >
      <Picker.Item label="Selecione o local" value="" />
      {(locationOptionsByFloor[eventData.locationFloor] || []).map((location) => (
        <Picker.Item key={location} label={location} value={location} />
      ))}
    </Picker>
</View>
    <Text style={[styles.label, { color: colors.text }]}>Status do Evento:</Text>
    <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>

    <Picker
      selectedValue={eventData.status}
      style={[styles.picker, { color: colors.text }]}
      dropdownIconColor={colors.text}
      onValueChange={(itemValue) => handleChange("status", itemValue)}
    >
      <Picker.Item label="Selecione o status" value="" />
        <Picker.Item label="Em Análise" value="EM_ANALISE" />
        <Picker.Item label="Indeterminado" value="INDETERMINADO" />
    </Picker>
</View>
    <Text style={[styles.label, { color: colors.text }]}>Status Administrativo:</Text>
    <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>
    <Picker
      selectedValue={eventData.administrativeStatus}
      onValueChange={(itemValue) => handleChange("administrativeStatus", itemValue)}
     style={[styles.picker, { color: colors.text }]}
        dropdownIconColor={colors.text}
    >
      <Picker.Item label="Selecione o status administrativo" value="" />
      <Picker.Item label="Aguardando" value="AGUARDANDO" />
    </Picker>
</View>

    <Text style={[styles.label, { color: colors.text }]}>Prioridade:</Text>
     <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>
    <Picker
      selectedValue={eventData.priority}
       style={[styles.picker, { color: colors.text }]}
        dropdownIconColor={colors.text}
      onValueChange={(itemValue) => handleChange("priority", itemValue)}
    >
      <Picker.Item label="Selecione a prioridade" value="" />
      <Picker.Item label="Indefinido" value="INDEFINIDO" />
    </Picker>
</View>
      <Text 
      style={[styles.label, { color: colors.text }]}>Duração de Limpeza</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[styles.input, { color: colors.text }, { backgroundColor: colors.card, borderColor: colors.accent }, { flex: 1, marginRight: 8 }]}
            placeholder="Horas"
             placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
            keyboardType="numeric"
            value={cleanupHours}
            onChangeText={setCleanupHours}
          />
          <TextInput
            style={[styles.input, { color: colors.text }, { backgroundColor: colors.card, borderColor: colors.accent }, { flex: 1}]}
            placeholder="Minutos"
            placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
            keyboardType="numeric"
            value={cleanupMinutes}
            onChangeText={setCleanupMinutes}
          />
        </View> 
        
      <Text style={[styles.label, { color: colors.text }]}>Observação:</Text>
      <TextInput
      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.accent }]}  
      placeholder="Observação" 
      placeholderTextColor={theme === "dark" ? "#aaa" : "#666"} 
      onChangeText={(text) => 
      handleChange("observation", text)} />
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonText}>Criar Evento Pendente</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

export default PendingEventFormScreen;

/*
 
  <Picker.Item label="Muito Baixa" value="MUITO_BAIXA" />
  <Picker.Item label="Baixa" value="BAIXA" />
  <Picker.Item label="Média" value="MEDIA" />
  <Picker.Item label="Alta" value="ALTA" />
  <Picker.Item label="Crítica" value="CRITICA" />  
  
 */