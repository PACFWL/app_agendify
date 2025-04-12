import React, { useEffect, useState, useContext } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { getPendingEventById } from "../../api/pendingEvent";
import { AuthContext } from "../../contexts/AuthContext";
import { RootStackParamList } from "../../routes/Routes";
import styles from "../../styles/PendingEventDetailsScreenStyles";

type PendingEventDetailsRouteProp = RouteProp<RootStackParamList, "PendingEventDetails">;

const PendingEventDetailsScreen = () => {
  const route = useRoute<PendingEventDetailsRouteProp>();
  const { eventId } = route.params;
  const auth = useContext(AuthContext);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (auth?.user) {
          const data = await getPendingEventById(auth.user.token, eventId);
          setEvent(data);
        }
      } catch (error) {
        Alert.alert("Erro", "Erro ao carregar detalhes do evento.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Carregando detalhes...</Text>
      </View>
    );
  }
         
  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Evento não encontrado.</Text>
      </View>
    );
  }

  return (
    
<ScrollView contentContainerStyle={styles.scrollContainer}>
<View style={styles.innerContainer}>
      <Text style={styles.title}>{event.name}</Text>

      <Text style={styles.label}>Data:</Text>
      <Text style={styles.value}>{event.day}</Text>

      <Text style={styles.label}>Horário:</Text>
      <Text style={styles.value}>
        {event.startTime} - {event.endTime}
      </Text>

      <Text style={styles.label}>Tema:</Text>
      <Text style={styles.value}>{event.theme}</Text>

      <Text style={styles.label}>Organizador:</Text>
      <Text style={styles.value}>{event.organizer}</Text>

      <Text style={styles.label}>Público-alvo:</Text>
      <Text style={styles.value}>{event.targetAudience}</Text>

      <Text style={styles.label}>Modalidade:</Text>
      <Text style={styles.value}>{event.mode}</Text>

      <Text style={styles.label}>Ambiente:</Text>
      <Text style={styles.value}>{event.environment}</Text>

      <Text style={styles.label}>Recursos:</Text>
      <Text style={styles.value}>
        {event.resourcesDescription?.join(", ") || "Nenhum"}
      </Text>

      <Text style={styles.label}>Forma de Divulgação:</Text>
      <Text style={styles.value}>{event.disclosureMethod}</Text>

      <Text style={styles.label}>Disciplinas Relacionadas:</Text>
      <Text style={styles.value}>
        {event.relatedSubjects?.join(", ") || "Nenhuma"}
      </Text>

      <Text style={styles.label}>Estratégia de Ensino:</Text>
      <Text style={styles.value}>{event.teachingStrategy}</Text>

      <Text style={styles.label}>Autores:</Text>
      <Text style={styles.value}>
        {event.authors?.join(", ") || "Nenhum"}
      </Text>

      <Text style={styles.label}>Cursos:</Text>
      <Text style={styles.value}>
        {event.courses?.join(", ") || "Nenhum"}
      </Text>

      <Text style={styles.label}>Vínculo Disciplinar:</Text>
      <Text style={styles.value}>{event.disciplinaryLink}</Text>

      <Text style={styles.label}>Local:</Text>
      <Text style={styles.value}>
        {event.location?.placeName || "Não informado"}
      </Text>

      <Text style={styles.label}>Status:</Text>
      <Text style={styles.value}>{event.status}</Text>

      <Text style={styles.label}>Prioridade:</Text>
      <Text style={styles.value}>{event.priority}</Text>

      <Text style={styles.label}>Tempo de Intervalo:</Text>
      <Text style={styles.value}>{event.cleanupDuration}</Text>

      <Text style={styles.label}>Observações:</Text>
      <Text style={styles.value}>{event.observation || "Nenhuma"}</Text>

      <Text style={styles.label}>Solicitante:</Text>
      <Text style={styles.value}>{event.eventRequesterId}</Text>

      <Text style={styles.label}>Criado em:</Text>
      <Text style={styles.value}>
        {new Date(event.createdAt).toLocaleString()}
      </Text>

      <Text style={styles.label}>Última modificação:</Text>
      <Text style={styles.value}>
        {new Date(event.lastModifiedAt).toLocaleString()}
      </Text>
       </View>
    </ScrollView>
   
  );  
};

export default PendingEventDetailsScreen;
