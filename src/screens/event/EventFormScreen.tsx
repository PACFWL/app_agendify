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
    handleCleanupHoursChange,
    handleCleanupMinutesChange,
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
       errors.name
        ? colors.inputErrorBackground
        : eventData.name.trim()
        ? colors.inputFilledBackground
        : colors.card,
      color: colors.text,
      borderColor: errors.name
        ? colors.error
        : eventData.name.trim()
        ? colors.success
        : colors.accent,
    }]} 
        value={eventData.name} 
        placeholder="Nome"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
        onChangeText={(text) => {
          handleChange("name", text);
        }}
      />
       {errors.name && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.name}</Text>}
     {!errors.name && eventData.name.trim() !== "" && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Nome válido</Text>
)}

      <Text style={[styles.label, { color: colors.text }]}>Data:</Text>
      <TouchableOpacity onPress={() => showPicker("date")}>
       <Text 
       style={[styles.input, { color: colors.text }, {
      backgroundColor: 
       errors.day
      ? colors.inputErrorBackground
      : eventData.day 
      ? colors.inputFilledBackground 
      : colors.card,
      borderColor: errors.day
        ? colors.error
        : eventData.day
        ? colors.success
        : colors.accent,
    }]}>
        {eventData.day || "Selecionar data"}</Text>
</TouchableOpacity>

 {errors.day && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.day}</Text>}
      
      {!errors.day && eventData.day && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Data válida</Text>
)}

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
        <Text 
       style={[
  styles.input,
  {
    backgroundColor: 
       errors.startTime
      ? colors.inputErrorBackground
      : eventData.startTime
      ? colors.inputFilledBackground
      : colors.card,
    color: colors.text,
    borderColor: errors.startTime
      ? colors.error
      : eventData.startTime
      ? colors.success
      : colors.accent,
  }
]}>{eventData.startTime || "Selecionar horário"}</Text>
      </TouchableOpacity>
      {errors.startTime && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.startTime}</Text>}
{!errors.startTime && eventData.startTime && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Horário de início válido</Text>
)}

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
        <Text style={[
  styles.input,
  {
    backgroundColor: 
      errors.endTime
      ? colors.inputErrorBackground
      : eventData.endTime
      ? colors.inputFilledBackground
      : colors.card,
    color: colors.text,
    borderColor: errors.endTime
      ? colors.error
      : eventData.endTime
      ? colors.success
      : colors.accent,
  }
]}>{eventData.endTime || "Selecionar horário"}</Text>
      </TouchableOpacity>
      {errors.endTime && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.endTime}</Text>}
      {!errors.endTime && eventData.endTime && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Horário de término válido</Text>
)}

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
          errors.theme
        ? colors.inputErrorBackground
        : eventData.theme.trim()
        ? colors.inputFilledBackground
        : colors.card, 
        color: colors.text, 
        borderColor: 
        errors.theme
        ? colors.error
        : eventData.theme.trim()
        ? colors.success
        : colors.accent }]} 
        placeholder="Tema"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
        onChangeText={(text) => {
          handleChange("theme", text);
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
              errors.targetAudience
            ? colors.inputErrorBackground
            : eventData.targetAudience.trim()
            ? colors.inputFilledBackground
            : colors.card, 
        color: colors.text, 
        borderColor: errors.targetAudience
            ? colors.error
            : eventData.targetAudience.trim()
            ? colors.success
            : colors.accent }]} 
          placeholder="Público-alvo" 
          placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
          onChangeText={(text) => {
          handleChange("targetAudience", text);
        }}
      />
      {errors.targetAudience && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.targetAudience}</Text>}
      {!errors.targetAudience && eventData.targetAudience.trim() !== "" && (
        <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Público-alvo válido</Text>
      )}
  
      <Text style={[styles.label, { color: colors.text }]}>Modalidade:</Text>
       <View style={[styles.pickerContainer, 
        { 
          backgroundColor: 
          errors.mode
        ? colors.inputErrorBackground
        : eventData.mode.trim()
        ? colors.inputFilledBackground
        : colors.card,  
          borderColor:   
          errors.mode
        ? colors.error
        : eventData.mode.trim()
        ? colors.success
        : colors.accent 
          }]}>
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
  {!errors.mode && eventData.mode.trim() !== "" && (
            <Text style={{ color: colors.success, marginBottom: 5 }}>✓ O modo válido</Text>
          )}

       <Text style={[styles.label, { color: colors.text }]}>Ambiente:</Text>
        
        <TextInput 
           style={[styles.input, { 
        backgroundColor: 
          errors.environment
        ? colors.inputErrorBackground
        : eventData.environment.trim()
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
         errors.organizer
        ? colors.inputErrorBackground
        : eventData.organizer.trim()
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
                style={[styles.input, {
        backgroundColor: 
         errors.resourcesDescription
          ? colors.inputErrorBackground
          : resource.trim()
          ? colors.inputFilledBackground
          : colors.card,
        color: colors.text,
        borderColor: errors.resourcesDescription
          ? colors.error
          : resource.trim()
          ? colors.success
          : colors.accent,
      }]}
              placeholder={`Recurso ${index + 1}`}
              placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
              value={resource}
              onChangeText={(text) => handleResourcesDescriptionChange(index, text)}
            />
{!errors.resourcesDescription && resource.trim() !== "" && /[a-zA-Z]/.test(resource) && (
      <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Recurso válido</Text>
    )}
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
         errors.disclosureMethod
        ? colors.inputErrorBackground
        : eventData.disclosureMethod.trim()
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
        }}
      />
      {errors.disclosureMethod && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.disclosureMethod}</Text>}
      {!errors.disclosureMethod && eventData.disclosureMethod.trim() !== "" && (
          <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Forma de Divulgação Preenchido</Text>
      )}

     <Text style={[styles.label, { color: colors.text }]}>Disciplinas Relacionadas:</Text>
    {eventData.relatedSubjects.map((relatedSubject, index) => (
      <React.Fragment key={index}>
        <TextInput
           style={[styles.input, {
        backgroundColor:
          errors.relatedSubjects
          ? colors.inputErrorBackground
          : relatedSubject.trim()
          ? colors.inputFilledBackground
          : colors.card,
        color: colors.text,
        borderColor: errors.relatedSubjects
          ? colors.error
          : relatedSubject.trim()
          ? colors.success
          : colors.accent,
      }]}
          placeholder={`Disciplina ${index + 1}`}
           placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
          value={relatedSubject}
          onChangeText={(text) => handleRelatedSubjectChange(index, text)}
        />
 {!errors.relatedSubjects && relatedSubject.trim() !== "" && /[a-zA-Z]/.test(relatedSubject) && (
      <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Disciplina válido</Text>
    )}
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
         errors.teachingStrategy
        ? colors.inputErrorBackground
        : eventData.teachingStrategy.trim()
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
                  style={[styles.input, {
        backgroundColor: 
          errors.authors
          ? colors.inputErrorBackground
          : author.trim()
          ? colors.inputFilledBackground
          : colors.card,
        color: colors.text,
        borderColor: errors.authors
          ? colors.error
          : author.trim()
          ? colors.success
          : colors.accent,
      }]}
              placeholder={`Autor ${index + 1}`}
               placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
              value={author}
              onChangeText={(text) => handleAuthorChange(index, text)}
            />
  {!errors.authors && author.trim() !== "" && /[a-zA-Z]/.test(author) && (
      <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Autor válido</Text>
    )}
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
                         style={[styles.input, {
        backgroundColor: 
          errors.courses
          ? colors.inputErrorBackground
          : course.trim()
          ? colors.inputFilledBackground
          : colors.card,
        color: colors.text,
        borderColor: errors.courses
          ? colors.error
          : course.trim()
          ? colors.success
          : colors.accent,
      }]}
            placeholder={`Curso ${index + 1}`}
            placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
            value={course}
            onChangeText={(text) => handleCourseChange(index, text)}
          />
 {!errors.courses && course.trim() !== "" && /[a-zA-Z]/.test(course) && (
      <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Curso válido</Text>
    )}
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
          errors.disciplinaryLink
        ? colors.inputErrorBackground   
        : eventData.disciplinaryLink.trim()
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
        }}
      />
      {errors.disciplinaryLink && <Text style={{ color: colors.error, marginBottom: 5 }}>{errors.disciplinaryLink}</Text>}
      {!errors.disciplinaryLink && eventData.disciplinaryLink.trim() !== "" && (
      <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Vínculo Disciplinar válido</Text>
    )}

       <Text style={[styles.label, { color: colors.text }]}>Andar:</Text>
        <View 
        style={[styles.pickerContainer, { 
          backgroundColor:   
          errors.locationFloor
        ? colors.inputErrorBackground
        : eventData.locationFloor
        ? colors.inputFilledBackground
        : colors.card, 
          borderColor: 
          errors.locationFloor
        ? colors.error
        : eventData.locationFloor
        ? colors.success
        : colors.accent,
          }]}>
      <Picker
        selectedValue={eventData.locationFloor}
        onValueChange={(itemValue) => {
          handleChange("locationFloor", itemValue);
          
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
      {!errors.locationFloor && eventData.locationFloor !== "" && (
        <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Andar válido</Text>
      )}

       <Text style={[styles.label, { color: colors.text }]}>Local:</Text>
      <View style={[styles.pickerContainer, 
        { 
          backgroundColor: 
          errors.locationName
        ? colors.inputErrorBackground
        : eventData.locationName
        ? colors.inputFilledBackground
        : colors.card, 
        borderColor: 
          errors.locationName
        ? colors.error
        : eventData.locationName
        ? colors.success
        : colors.accent,
          }]}>

      <Picker
        selectedValue={eventData.locationName}
        onValueChange={(itemValue) => {
          handleChange("locationName", itemValue);
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
  {!errors.locationName && eventData.locationName !== "" && (
            <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Local válido</Text>
          )}


    <Text style={[styles.label, { color: colors.text }]}>Status do Evento:</Text>
    <View style={[styles.pickerContainer, 
      { backgroundColor: 
      errors.status
        ? colors.inputErrorBackground
        : eventData.status
        ? colors.inputFilledBackground
        : colors.card,
      borderColor: 
      errors.status
        ? colors.error
        : eventData.status
        ? colors.success
        : colors.accent,
           }]}>
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
       {!errors.status && eventData.status !== "" && (
  <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Status válido</Text>
)}

      <Text style={[styles.label, { color: colors.text }]}>Status Administrativo:</Text>
    <View
      style={[
        styles.pickerContainer,
        {
          backgroundColor: 
            errors.administrativeStatus
            ? colors.inputErrorBackground
            : eventData.administrativeStatus
            ? colors.inputFilledBackground
            : colors.card,
          borderColor: errors.administrativeStatus
            ? colors.error
            : eventData.administrativeStatus
            ? colors.success
            : colors.accent,
        }
      ]}
    >
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
          {errors.administrativeStatus && (
            <Text style={{ color: colors.error, marginBottom: 5 }}>
              {errors.administrativeStatus}
            </Text>
          )}
          {!errors.administrativeStatus && eventData.administrativeStatus !== "" && (
            <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Status administrativo válido</Text>
          )}

           <Text style={[styles.label, { color: colors.text }]}>Prioridade:</Text>
           <View 
           style={[styles.pickerContainer, { 
            backgroundColor:   
            errors.priority
              ? colors.inputErrorBackground
              : eventData.priority
              ? colors.inputFilledBackground
              : colors.card,
             borderColor:  
             errors.priority
              ? colors.error
              : eventData.priority
              ? colors.success
              : colors.accent,
         }]}>
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
        {errors.priority && (
          <Text style={{ color: colors.error, marginBottom: 5 }}>
            {errors.priority}
          </Text>
        )}
        {!errors.priority && eventData.priority !== "" && (
          <Text style={{ color: colors.success, marginBottom: 5 }}>✓ Prioridade válido</Text>
        )}
       <Text style={[styles.label, { color: colors.text }]}>Duração de Limpeza</Text>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={{
                backgroundColor: 
                errors.cleanupHours 
                ? colors.inputErrorBackground 
                : (cleanupHours 
                  ? colors.inputFilledBackground 
                  : colors.card),
                borderColor: errors.cleanupHours ? colors.error : (cleanupHours ? colors.success : colors.accent),
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 12,
                color: colors.text,
              }}
              placeholder="Horas"
              placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
              keyboardType="numeric"
              value={cleanupHours}
              onChangeText={handleCleanupHoursChange}
            />
            {errors.cleanupHours && <Text style={{ color: colors.error, marginTop: 4 }}>{errors.cleanupHours}</Text>}
            {!errors.cleanupHours && cleanupHours.trim() !== "" && (
              <Text style={{ color: colors.success, marginTop: 4 }}>✓ Horas válidas</Text>
            )}
          </View>
         
         <View style={{ flex: 1 }}>
            <TextInput
              style={{
                backgroundColor: errors.cleanupMinutes ? colors.inputErrorBackground : (cleanupMinutes ? colors.inputFilledBackground : colors.card),
                borderColor: errors.cleanupMinutes ? colors.error : (cleanupMinutes ? colors.success : colors.accent),
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 12,
                color: colors.text,
              }}
              placeholder="Minutos"
              placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
              keyboardType="numeric"
              value={cleanupMinutes}
              onChangeText={handleCleanupMinutesChange}
            />
            {errors.cleanupMinutes && <Text style={{ color: colors.error, marginTop: 4 }}>{errors.cleanupMinutes}</Text>}
            {!errors.cleanupMinutes && cleanupMinutes.trim() !== "" && (
              <Text style={{ color: colors.success, marginTop: 4 }}>✓ Minutos válidos</Text>
            )}
          </View>
        </View>
      {errors.cleanupDuration && (
        <Text style={{ color: colors.error, marginBottom: 8 }}>{errors.cleanupDuration}</Text>
      )}
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
