  import React, { useContext, useState } from "react";
  import {View,Text,TextInput,Button,FlatList,TouchableOpacity} from "react-native";
  import { AuthContext } from "../../contexts/AuthContext";
  import { searchEvents } from "../../api/event";
  import RemoteSvgIcon from "../../components/RemoteSvgIcon"; 
  import styles from "../../styles/SearchScreenStyles";

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
    priority: string;
    observation: string;
  };

const SearchScreen = () => {
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
  const [observation, setObservation] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationFloor, setLocationFloor] = useState("");
  const [day, setDay] = useState("");
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

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
      }

      const data = await searchEvents(auth?.user?.token || "", filter);
      setResults(data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

const renderHeader = () => (
  <View>
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
        <TextInput style={styles.input} placeholder="Status do evento" value={status} onChangeText={setStatus} />
        <TextInput style={styles.input} placeholder="Tema" value={theme} onChangeText={setTheme} />
        <TextInput style={styles.input} placeholder="Modalidade" value={mode} onChangeText={setMode} />
        <TextInput style={styles.input} placeholder="Prioridade" value={priority} onChangeText={setPriority} />
        <TextInput style={styles.input} placeholder="Público-alvo" value={targetAudience} onChangeText={setTargetAudience} />
        <TextInput style={styles.input} placeholder="Ambiente" value={environment} onChangeText={setEnvironment} />
        <TextInput style={styles.input} placeholder="Método de divulgação" value={disclosureMethod} onChangeText={setDisclosureMethod} />
        <TextInput style={styles.input} placeholder="Estratégia de ensino" value={teachingStrategy} onChangeText={setTeachingStrategy} />
        <TextInput style={styles.input} placeholder="Vínculo disciplinar" value={disciplinaryLink} onChangeText={setDisciplinaryLink} />
        <TextInput style={styles.input} placeholder="Observação" value={observation} onChangeText={setObservation} />
        <TextInput style={styles.input} placeholder="Local (nome)" value={locationName} onChangeText={setLocationName} />
        <TextInput style={styles.input} placeholder="Local (andar)" value={locationFloor} onChangeText={setLocationFloor} />
        <TextInput style={styles.input} placeholder="Data específica (YYYY-MM-DD)" value={day} onChangeText={setDay} />
        <TextInput style={styles.input} placeholder="Início do intervalo (YYYY-MM-DD)" value={startDay} onChangeText={setStartDay} />
        <TextInput style={styles.input} placeholder="Fim do intervalo (YYYY-MM-DD)" value={endDay} onChangeText={setEndDay} />
        <TextInput style={styles.input} placeholder="Horário inicial (HH:mm)" value={startTime} onChangeText={setStartTime} />
        <TextInput style={styles.input} placeholder="Horário final (HH:mm)" value={endTime} onChangeText={setEndTime} />
      </>
    )}

    <Button title="Buscar" onPress={handleSearch} />
    {loading && <Text style={{ marginTop: 16 }}>Carregando...</Text>}
  </View>
);

return (
  <FlatList
    style={styles.container}
    data={results}
    keyExtractor={(item) => item.id}
    ListHeaderComponent={renderHeader}
    renderItem={({ item }) => (
      <View style={styles.eventItem}>
        <Text style={styles.eventTitle}>{item.name}</Text>
        <Text>
          {item.day} - {item.startTime} às {item.endTime}
        </Text>
        <Text>Tema: {item.theme}</Text>
        <Text>Organizador: {item.organizer}</Text>
      </View>
    )}
  />
);
};

export default SearchScreen;