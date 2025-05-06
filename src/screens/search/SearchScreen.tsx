import React, { useContext, useState } from "react";
import {View,Text,TextInput,Button,ScrollView,TouchableOpacity,KeyboardAvoidingView,Platform, Switch} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../../contexts/AuthContext";
import { searchEvents } from "../../api/event";
import RemoteSvgIcon from "../../components/RemoteSvgIcon";
import styles from "../../styles/SearchScreenStyles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = NativeStackScreenProps<RootStackParamList, "Search">;

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
  disclosureMethod: string;
  teachingStrategy: string;
  disciplinaryLink: string;
  status: string;
  administrativeStatus: string;
  cleanupDuration: string;
  priority: string;
  observation: string;
};
 
const SearchScreen = ({ navigation }: Props) => {
  const auth = useContext(AuthContext);
  const [name, setName] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState("");
  const [mode, setMode] = useState("");
  const [priority, setPriority] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [environment, setEnvironment] = useState("");
  const [disclosureMethod, setDisclosureMethod] = useState("");
  const [teachingStrategy, setTeachingStrategy] = useState("");
  const [disciplinaryLink, setDisciplinaryLink] = useState("");
  const [administrativeStatus, setAdministrativeStatus] = useState("");
  const [observation, setObservation] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationFloor, setLocationFloor] = useState("");
  const [day, setDay] = useState("");
  const [dayDisplay, setDayDisplay] = useState(""); 
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [intervalSearch, setIntervalSearch] = useState(false);
  const [cleanupDuration, setCleanupDuration] = useState("");
  const [cleanupHours, setCleanupHours] = useState("");
  const [cleanupMinutes, setCleanupMinutes] = useState("");
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

const handleDateChange = (_: any, selectedDate?: Date) => {
  setShowDatePicker(false);
  if (!selectedDate) return;

  setSelectedDay(selectedDate);
  setDay(format(selectedDate, "yyyy-MM-dd")); 
  setDayDisplay(format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })); 
};

const handleStartTimeChange = (_: any, selectedDate?: Date) => {
  setShowStartTimePicker(false);
  if (!selectedDate) return;
  setStartTime(format(selectedDate, "HH:mm:ss")); 
};

const handleEndTimeChange = (_: any, selectedDate?: Date) => {
  setShowEndTimePicker(false);
  if (!selectedDate) return;
  setEndTime(format(selectedDate, "HH:mm:ss")); 
};

const showPicker = (type: "date" | "start" | "end") => {
  if (type === "date") setShowDatePicker(true);
  else if (type === "start") setShowStartTimePicker(true);
  else if (type === "end") setShowEndTimePicker(true);
};

  const locationOptionsByFloor: Record<string, string[]> = {
    "0": ["A definir", "Auditório", "Sala Maker", "Hall Principal", "Sala T01", "Sala T02", "Sala T03"],
    "1": ["A definir", "Sala de Informática 001", "Sala de Informática 002", "Sala de Informática 003", "Sala de Informática 004",
      "Sala 111", "Sala de Aula 001", "Sala de Aula 002", "Sala de Aula 003", "Sala de Aula 004",
      "Sala de Aula 005", "Sala de Aula 006", "Sala de Aula 007", "Sala de Aula 008", "Sala de Aula 009"
    ],
    "2": ["A definir", "Sala de Informática 001", "Sala de Informática 002", "Sala de Informática 003", "Sala de Informática 004",
      "Sala de Aula 001", "Sala de Aula 002", "Sala de Aula 003", "Sala de Aula 004",
      "Sala de Aula 005", "Sala de Aula 006", "Sala de Aula 007", "Sala de Aula 008",
      "Sala de Aula 009", "Sala de Aula 010"
    ],
    "3": ["A definir", "Sala de Aula 1", "Sala de Aula 2"],
  };
  
  const handleSearch = async () => {
    setLoading(true);
    try {
      const filter: any = { name };

      if (showFilters) {
        if (organizer) filter.organizer = organizer;
        if (status) filter.status = status;
        if (theme) filter.theme = theme;
        if (mode) filter.mode = mode;
        if (priority) filter.priority = priority;
        if (targetAudience) filter.targetAudience = targetAudience;
        if (environment) filter.environment = environment;
        if (disclosureMethod) filter.disclosureMethod = disclosureMethod;
        if (teachingStrategy) filter.teachingStrategy = teachingStrategy;
        if (disciplinaryLink) filter.disciplinaryLink = disciplinaryLink;
        if (administrativeStatus) filter.administrativeStatus = administrativeStatus;
        if (observation) filter.observation = observation;
        if (locationName) filter.locationName = locationName;
        if (locationFloor) filter.locationFloor = locationFloor;
        if (day) filter.day = day;
        if (startDay && endDay) {
          filter.startDay = startDay;
          filter.endDay = endDay;
        }
        if (startTime) filter.startTime = startTime;
        if (endTime) filter.endTime = endTime;
  
        if (startTime && endTime) {
          filter.intervalSearch = intervalSearch; 
        }

         if (cleanupHours || cleanupMinutes) {
        let duration = "PT";
        if (cleanupHours) duration += `${parseInt(cleanupHours)}H`;
        if (cleanupMinutes) duration += `${parseInt(cleanupMinutes)}M`;
        filter.cleanupDuration = duration;
      }
      }
      const data = await searchEvents(auth?.user?.token || "", filter);
      setResults(data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Buscar Eventos</Text>
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <RemoteSvgIcon
              uri="https://www.svgrepo.com/show/362103/funnel.svg"
              size={24}
              color="#6200ee"
            />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nome do evento"
          value={name}
          onChangeText={setName}
        />

        {showFilters && (
          <>
            <TextInput style={styles.input} placeholder="Organizador" value={organizer} onChangeText={setOrganizer} />
            <Text style={styles.label}>Status</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue)}
              >
                <Picker.Item label="Selecione o status" value="" />
                <Picker.Item label="Planejado" value="PLANEJADO" />
                <Picker.Item label="Em Breve" value="EM_BREVE" />
                <Picker.Item label="Em Andamento" value="EM_ANDAMENTO" />
                <Picker.Item label="Em Pausa" value="EM_PAUSA" />
                <Picker.Item label="Finalizado" value="FINALIZADO" />
                <Picker.Item label="Aprovado" value="APROVADO" />
              </Picker>
            </View>
            <TextInput style={styles.input} placeholder="Tema" value={theme} onChangeText={setTheme} />
            <Text style={styles.label}>Modalidade</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={mode}
                onValueChange={(itemValue) => setMode(itemValue)}
              >
                <Picker.Item label="Selecione a modalidade" value="" />
                <Picker.Item label="Presencial" value="PRESENCIAL" />
                <Picker.Item label="Online" value="ONLINE" />
                <Picker.Item label="Híbrido" value="HIBRIDO" />
              </Picker>
            </View>
            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={priority}
                onValueChange={(itemValue) => setPriority(itemValue)}
              >
                <Picker.Item label="Selecione a prioridade" value="" />
                <Picker.Item label="Muito Baixa" value="MUITO_BAIXA" />
                <Picker.Item label="Baixa" value="BAIXA" />
                <Picker.Item label="Média" value="MEDIA" />
                <Picker.Item label="Alta" value="ALTA" />
                <Picker.Item label="Crítica" value="CRITICA" />
              </Picker>
            </View>
            <TextInput style={styles.input} placeholder="Público-alvo" value={targetAudience} onChangeText={setTargetAudience} />
            <TextInput style={styles.input} placeholder="Ambiente" value={environment} onChangeText={setEnvironment} />
            <TextInput style={styles.input} placeholder="Método de divulgação" value={disclosureMethod} onChangeText={setDisclosureMethod} />
            <TextInput style={styles.input} placeholder="Estratégia de ensino" value={teachingStrategy} onChangeText={setTeachingStrategy} />
            <TextInput style={styles.input} placeholder="Vínculo disciplinar" value={disciplinaryLink} onChangeText={setDisciplinaryLink} />
            <Text style={styles.label}>Status Administrativo</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={administrativeStatus}
                onValueChange={(itemValue) => setAdministrativeStatus(itemValue)}
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
            <TextInput style={styles.input} placeholder="Observação" value={observation} onChangeText={setObservation} />
            <Text style={styles.label}>Andar do Local</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={locationFloor}
                onValueChange={(itemValue) => {
                  setLocationFloor(itemValue);
                  setLocationName(""); 
                }}
              >
                <Picker.Item label="Selecione o andar" value="" />
                <Picker.Item label="Térreo" value="0" />
                <Picker.Item label="1º Andar" value="1" />
                <Picker.Item label="2º Andar" value="2" />
                <Picker.Item label="Bloco C" value="3" />
              </Picker>
            </View>

            <Text style={styles.label}>Local do Evento</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={locationName}
                onValueChange={(itemValue) => setLocationName(itemValue)}
                enabled={!!locationFloor && locationOptionsByFloor[locationFloor]?.length > 0}
              >
                <Picker.Item label="Selecione o local" value="" />
                {(locationOptionsByFloor[locationFloor] || []).map((location) => (
                  <Picker.Item key={location} label={location} value={location} />
                ))}
              </Picker>
            </View>
            <Text style={styles.label}>Data:</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => showPicker("date")} style={{ flex: 1 }}>
                <Text style={styles.input}>{dayDisplay || "Selecionar data"}</Text>
              </TouchableOpacity>
              {day !== "" && (
                <TouchableOpacity onPress={() => { setDay(""); setDayDisplay(""); }} style={{ marginLeft: 8 }}>
                  <Text style={{ color: "#6200ee" }}>Limpar</Text>
                </TouchableOpacity>
              )}
            </View>
              {showDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="default"
                  value={selectedDay ?? new Date()}
                  onChange={handleDateChange}
                />
              )}
              <Text style={styles.label}>Horário de Início:</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => showPicker("start")} style={{ flex: 1 }}>
                  <Text style={styles.input}>{startTime || "Selecionar horário"}</Text>
                </TouchableOpacity>
                {startTime !== "" && (
                  <TouchableOpacity onPress={() => setStartTime("")} style={{ marginLeft: 8 }}>
                    <Text style={{ color: "#6200ee" }}>Limpar</Text>
                  </TouchableOpacity>
                )}
              </View>
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
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => showPicker("end")} style={{ flex: 1 }}>
                  <Text style={styles.input}>{endTime || "Selecionar horário"}</Text>
                </TouchableOpacity>
                {endTime !== "" && (
                  <TouchableOpacity onPress={() => setEndTime("")} style={{ marginLeft: 8 }}>
                    <Text style={{ color: "#6200ee" }}>Limpar</Text>
                  </TouchableOpacity>
                )}
              </View>
              {showEndTimePicker && (
                <DateTimePicker
                  mode="time"
                  display="default"
                  value={new Date()}
                  onChange={handleEndTimeChange}
                  is24Hour={true}
                />
              )}
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
            <Text style={{ marginRight: 10 }}>Busca por intervalo?</Text>
            <Switch
              value={intervalSearch}
              onValueChange={setIntervalSearch}
            />

          </View>
          <Text style={styles.label}>Duração de Limpeza</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="Horas"
                value={cleanupHours}
                onChangeText={setCleanupHours}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Minutos"
                value={cleanupMinutes}
                onChangeText={setCleanupMinutes}
                keyboardType="numeric"
              />
            </View>
            <TextInput style={styles.input} placeholder="Início do intervalo (YYYY-MM-DD)" value={startDay} onChangeText={setStartDay} />
            <TextInput style={styles.input} placeholder="Fim do intervalo (YYYY-MM-DD)" value={endDay} onChangeText={setEndDay} />
          </>
        )}
        <Button title="Buscar" onPress={handleSearch} />
        {loading && <Text style={{ marginTop: 16 }}>Carregando...</Text>}

        {results.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
            style={styles.eventItem}
          >
            <Text style={styles.eventTitle}>{item.name}</Text>
            <Text>
              {item.day} - {item.startTime} às {item.endTime}
            </Text>
            <Text>Tema: {item.theme}</Text>
            <Text>Organizador: {item.organizer}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchScreen;
