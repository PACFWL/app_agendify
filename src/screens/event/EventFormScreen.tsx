import React, { useContext } from "react";
import { Text, TextInput, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Picker } from '@react-native-picker/picker';

import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { createEvent } from "../../api/event";
import { RootStackParamList } from "../../routes/Routes";
import { useEventForm } from "../../hooks/useEventForm";
import styles from "../../styles/EventFormScreenStyles";
import { getColors } from "../../styles/ThemeColors";

type Props = NativeStackScreenProps<RootStackParamList, "EventForm">;

const locationOptionsByFloor: Record<string, string[]> = {
  "0": ["Auditório", "Sala Maker", "Hall Principal", "Sala T01", "Sala T02", "Sala T03"],
  "1": ["Sala de Informática 001", "Sala de Informática 002", "Sala de Informática 003", "Sala de Informática 004", "Sala 111", "Sala de Informática 001", "Sala de Aula 001", "Sala de Aula 002", "Sala de Aula 003", "Sala de Aula 004", "Sala de Aula 005", "Sala de Aula 006", "Sala de Aula 007", "Sala de Aula 008", "Sala de Aula 009"],
  "2": ["Sala de Informática 001", "Sala de Informática 002", "Sala de Informática 003", "Sala de Informática 004", "Sala de Aula 001", "Sala de Aula 002", "Sala de Aula 003", "Sala de Aula 004", "Sala de Aula 005", "Sala de Aula 006", "Sala de Aula 007", "Sala de Aula 008", "Sala de Aula 009", "Sala de Aula 010"],
  "3": ["Sala de Aula 1", "Sala de Aula 2"],
};

const EventFormScreen = ({ navigation }: Props) => {
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
    handleEndTimeChange,
    validateFields,
    errors,
    setErrors
  } = useEventForm();

  const handleSubmit = async () => {
    const validationErrors = validateFields();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
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
        location: {
          name: eventData.locationName,
          floor: eventData.locationFloor
        },
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={[styles.title, { color: colors.primary }]}>Criar Novo Evento</Text>
      <Text style={[styles.label, { color: colors.text }]}>Nome:</Text>
      <TextInput 
        style={[styles.input, {
      backgroundColor: 
      eventData.name.trim()
        ? colors.inputFilledBackground
        : colors.card,
      color: colors.text,
      borderColor: errors.name
        ? colors.error
        : eventData.name.trim()
          ? colors.success
          : colors.accent,
    },]} 
        value={eventData.name} 
        placeholder="Nome"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
        onChangeText={(text) => {
          handleChange("name", text);
          setErrors((prev) => ({ ...prev, name: "" }));
        }}
      />
       {errors.name && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.name}</Text>}
     {!errors.name && eventData.name.trim() !== "" && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Nome válido</Text>
)}

      <Text style={[styles.label, { color: colors.text }]}>Data:</Text>
      <TouchableOpacity onPress={() => showPicker("date")}>
       <Text style={[styles.input, { color: colors.text }, { backgroundColor: colors.card, borderColor: colors.accent }]}>
        {eventData.day || "Selecionar data"}</Text>
</TouchableOpacity>

 {errors.day && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.day}</Text>}
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
      {errors.startTime && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.startTime}</Text>}
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
      {errors.endTime && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.endTime}</Text>}
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
          style={[styles.input, { 
        backgroundColor: 
        eventData.theme.trim()
        ? colors.inputFilledBackground
        : colors.card, 
        color: colors.text, 
        borderColor: errors.theme
        ? colors.error
        : eventData.theme.trim()
          ? colors.success
          : colors.accent },]} 
        placeholder="Tema"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
        onChangeText={(text) => {
          handleChange("theme", text);
          setErrors((prev) => ({ ...prev, theme: "" }));
        }}
      />
      {errors.theme && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.theme}</Text>}
          {!errors.theme && eventData.theme.trim() !== "" && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Tema válido</Text>
)}

      <Text style={[styles.label, { color: colors.text }]}>Público-alvo:</Text>
      <TextInput 
      style={[styles.input, { 
        backgroundColor: 
        eventData.targetAudience.trim()
        ? colors.inputFilledBackground
        : colors.card, 
        color: colors.text, 
        borderColor: errors.targetAudience
        ? colors.error
        : eventData.targetAudience.trim()
          ? colors.success
          : colors.accent },]} 
      placeholder="Público-alvo" 
      placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
      onChangeText={(text) => {
          handleChange("targetAudience", text);
          setErrors((prev) => ({ ...prev, targetAudience: "" }));
        }}
      />
    {errors.targetAudience && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.targetAudience}</Text>}

  {!errors.targetAudience && eventData.targetAudience.trim() !== "" && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Público-alvo válido</Text>
)}

      <Text style={[styles.label, { color: colors.text }]}>Modalidade:</Text>
       <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>
      <Picker
        selectedValue={eventData.mode}
        onValueChange={(itemValue) => handleChange("mode", itemValue)}
         style={[styles.picker, { color: colors.text }]}
      >
      <Picker.Item label="Selecione a modalidade" value="" />
        <Picker.Item label="Presencial" value="PRESENCIAL" />
        <Picker.Item label="Online" value="ONLINE" />
        <Picker.Item label="Híbrido" value="HIBRIDO" />
      </Picker>
      </View>
      {errors.mode && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.mode}</Text>}

       <Text style={[styles.label, { color: colors.text }]}>Ambiente:</Text>
        
        <TextInput 
           style={[styles.input, { 
        backgroundColor: 
        eventData.environment.trim()
        ? colors.inputFilledBackground
        : colors.card, 
        color: colors.text, 
        borderColor: errors.environment
        ? colors.error
        : eventData.environment.trim()
          ? colors.success
          : colors.accent },]} 
          placeholder="Ambiente" 
          placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
          onChangeText={(text) =>  {
          handleChange("environment", text);
          setErrors((prev) => ({ ...prev, environment: "" }));
        }}
      />
      {errors.environment && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.environment}</Text>}
  {!errors.environment && eventData.environment.trim() !== "" && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Ambiente válido</Text>
)}

       <Text style={[styles.label, { color: colors.text }]}>Organizador:</Text>
        <TextInput 
          style={[styles.input, { 
        backgroundColor: 
        eventData.organizer.trim()
        ? colors.inputFilledBackground
        : colors.card, 
        color: colors.text, 
        borderColor: errors.organizer
        ? colors.error
        : eventData.organizer.trim()
          ? colors.success
          : colors.accent },]} 
          placeholder="Organizador" 
          placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
          onChangeText={(text) =>  {
          handleChange("organizer", text);
          setErrors((prev) => ({ ...prev, organizer: "" }));
        }}
      />
      {errors.organizer && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.organizer}</Text>}
  {!errors.organizer && eventData.organizer.trim() !== "" && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Organizador válido</Text>
)}

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
       <TouchableOpacity style={styles.removeButton}  onPress={() => removeResourcesDescriptionField(index)}>
          <Text style={styles.addButtonText}>Remover</Text>
       </TouchableOpacity>
            )}
          </React.Fragment>
        ))}
    <TouchableOpacity style={styles.addButton} onPress={addResourcesDescriptionField}>
      <Text style={styles.addButtonText}>Adicionar Recurso</Text>
    </TouchableOpacity>
    {errors.resourcesDescription && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.resourcesDescription}</Text>}

       <Text style={[styles.label, { color: colors.text }]}>Forma de Divulgação:</Text>
        <TextInput 
           style={[styles.input, { 
        backgroundColor: 
        eventData.disclosureMethod.trim()
        ? colors.inputFilledBackground
        : colors.card, 
        color: colors.text, 
        borderColor: errors.disclosureMethod
        ? colors.error
        : eventData.disclosureMethod.trim()
          ? colors.success
          : colors.accent },]}   
          placeholder="Forma de Divulgação" 
          placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
          onChangeText={(text) =>  {
          handleChange("disclosureMethod", text);
          setErrors((prev) => ({ ...prev, disclosureMethod: "" }));
        }}
      />
      {errors.disclosureMethod && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.disclosureMethod}</Text>}
  {!errors.disclosureMethod && eventData.disclosureMethod.trim() !== "" && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Forma de Divulgação válido</Text>
)}

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
          <TouchableOpacity style={styles.removeButton}  onPress={() => removeRelatedSubjectField(index)}>
              <Text style={styles.addButtonText}>Remover</Text>
          </TouchableOpacity>
        )}
      </React.Fragment>
    ))}
    <TouchableOpacity style={styles.addButton} onPress={addRelatedSubjectField}>
      <Text style={styles.addButtonText}>Adicionar Disciplina</Text>
    </TouchableOpacity>
    {errors.relatedSubjects && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.relatedSubjects}</Text>}

       <Text style={[styles.label, { color: colors.text }]}>Estratégia de Ensino:</Text>
        <TextInput 
         style={[styles.input, { 
        backgroundColor: 
        eventData.teachingStrategy.trim()
        ? colors.inputFilledBackground
        : colors.card, 
        color: colors.text, 
        borderColor: errors.teachingStrategy
        ? colors.error
        : eventData.teachingStrategy.trim()
          ? colors.success
          : colors.accent },]} 
          placeholder="Estratégia de Ensino" 
          placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
          onChangeText={(text) =>  {
          handleChange("teachingStrategy", text);
          setErrors((prev) => ({ ...prev, teachingStrategy: "" }));
        }}
      />
      {errors.teachingStrategy && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.teachingStrategy}</Text>}
  {!errors.teachingStrategy && eventData.teachingStrategy.trim() !== "" && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Estratégia de Ensino válido</Text>
)}
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
              <TouchableOpacity style={styles.removeButton}   onPress={() => removeAuthorField(index)}>
                  <Text style={styles.addButtonText}>Remover</Text>
              </TouchableOpacity>
            )}
          </React.Fragment>
        ))}

          <TouchableOpacity style={styles.addButton} onPress={addAuthorField}>
            <Text style={styles.addButtonText}>Adicionar Autor</Text>
          </TouchableOpacity> 
      {errors.authors && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.authors}</Text>}


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
          <TouchableOpacity style={styles.removeButton}   onPress={() => removeCourseField(index)}>
                <Text style={styles.addButtonText}>Remover</Text>
            </TouchableOpacity>
          )}
        </React.Fragment>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addCourseField}>
        <Text style={styles.addButtonText}>Adicionar Curso</Text>
      </TouchableOpacity>
      {errors.courses && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.courses}</Text>}

       <Text style={[styles.label, { color: colors.text }]}>Vínculo Disciplinar:</Text>
        <TextInput 
          style={[styles.input, { 
        backgroundColor: 
        eventData.disciplinaryLink.trim()
        ? colors.inputFilledBackground
        : colors.card, 
        color: colors.text, 
        borderColor: errors.disciplinaryLink
        ? colors.error
        : eventData.disciplinaryLink.trim()
          ? colors.success
          : colors.accent },]} 
          placeholder="Vínculo Disciplinar" 
          placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
          onChangeText={(text) => {
          handleChange("disciplinaryLink", text);
          setErrors((prev) => ({ ...prev, disciplinaryLink: "" }));
        }}
      />
      {errors.disciplinaryLink && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.disciplinaryLink}</Text>}
  {!errors.disciplinaryLink && eventData.disciplinaryLink.trim() !== "" && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Vínculo Disciplinar válido</Text>
)}

       <Text style={[styles.label, { color: colors.text }]}>Andar:</Text>
        <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>
      <Picker
        selectedValue={eventData.locationFloor}
        onValueChange={(itemValue) => {
          handleChange("locationFloor", itemValue);
          setErrors((prev) => ({ ...prev, locationFloor: "" }));
        }}
        style={[styles.picker, { color: colors.text }]}
        dropdownIconColor={colors.text}
      >
        <Picker.Item label="Selecione o andar" value="" />
        <Picker.Item label="Térreo" value="0" />
        <Picker.Item label="1º Andar" value="1" />
        <Picker.Item label="2º Andar" value="2" />
        <Picker.Item label="3º Andar" value="3" />
      </Picker>
      </View>
      {errors.locationFloor && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.locationFloor}</Text>}

       <Text style={[styles.label, { color: colors.text }]}>Local:</Text>
      <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>

      <Picker
        selectedValue={eventData.locationName}
        onValueChange={(itemValue) => {
          handleChange("locationName", itemValue);
          setErrors((prev) => ({ ...prev, locationName: "" }));
        }}
        style={[styles.picker, { color: colors.text }]}
        dropdownIconColor={colors.text}
      >
        <Picker.Item label="Selecione o local" value="" />
        {locationOptionsByFloor[eventData.locationFloor]?.map((location, index) => (
          <Picker.Item key={index} label={location} value={location} />
        ))}
      </Picker>
      </View>
      {errors.locationName && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.locationName}</Text>}

    <Text style={[styles.label, { color: colors.text }]}>Status do Evento:</Text>
    <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>

    <Picker
      selectedValue={eventData.status}
      onValueChange={(itemValue) => handleChange("status", itemValue)}
      style={[styles.picker, { color: colors.text }]}
      dropdownIconColor={colors.text}
    >
      <Picker.Item label="Selecione o status" value="" />
      <Picker.Item label="Planejado" value="PLANEJADO" />
    </Picker>
    </View>
   {errors.status && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.status}</Text>}
       
       
       <Text style={[styles.label, { color: colors.text }]}>Status Administrativo:</Text>
       <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>
      <Picker
        selectedValue={eventData.administrativeStatus}
        onValueChange={(itemValue) => handleChange("administrativeStatus", itemValue)}
        style={[styles.picker, { color: colors.text }]}
        dropdownIconColor={colors.text}
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
      </View>
       {errors.administrativeStatus && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.administrativeStatus}</Text>}
        
           <Text style={[styles.label, { color: colors.text }]}>Prioridade:</Text>
           <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.accent }]}>

          <Picker
            selectedValue={eventData.priority}
            onValueChange={(itemValue) => handleChange("priority", itemValue)}
           style={[styles.picker, { color: colors.text }]}
        dropdownIconColor={colors.text}
          >
            <Picker.Item label="Selecione a prioridade" value="" />
            <Picker.Item label="Indefinido" value="INDEFINIDO" />
            <Picker.Item label="Muito Baixa" value="MUITO_BAIXA" />
            <Picker.Item label="Baixa" value="BAIXA" />
            <Picker.Item label="Média" value="MEDIA" />
            <Picker.Item label="Alta" value="ALTA" />
            <Picker.Item label="Crítica" value="CRITICA" />
          </Picker>
          </View>
  {errors.priority && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.priority}</Text>}

       <Text style={[styles.label, { color: colors.text }]}>Duração de Limpeza</Text>
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
      onChangeText={(text) => handleChange("observation", text)} />
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Criar Evento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EventFormScreen;