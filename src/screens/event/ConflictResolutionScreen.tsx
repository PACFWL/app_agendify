import React, { useContext } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/Routes";
import { resolveEventConflict } from "../../api/event";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext"; 
import { ThemeContext } from "../../contexts/ThemeContext";
import { getColors } from "../../styles/ThemeColors";
import styles from "../../styles/ConflictResolutionScreenStyles";

type Props = NativeStackScreenProps<RootStackParamList, "ConflictResolution">;

const ConflictResolutionScreen = ({ route }: Props) => {
  const { newEvent, existingEvent } = route.params;
  const navigation = useNavigation();
  const auth = useContext(AuthContext);

  const { theme } = useContext(ThemeContext);
  const themeColors = getColors(theme);

  const handleReplace = async () => {
    try {
      if (!auth?.user?.token) {
        throw new Error("Token de autenticação ausente.");
      }

      await resolveEventConflict(auth.user.token, existingEvent.id, newEvent); 
      Alert.alert("Evento substituído com sucesso!");
      navigation.goBack();
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro ao substituir o evento.");
    }
  };

   const renderEventDetails = (event: any, title: string) => (
    <View style={[styles.detailCard, { backgroundColor: themeColors.card }]}>
      <Text style={[styles.detailTitle, { color: themeColors.primary }]}>{title}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Nome: {event.name}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Data: {event.day}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Horário: {event.startTime} - {event.endTime}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Tema: {event.theme}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Público-alvo: {event.targetAudience}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Modalidade: {event.mode}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Ambiente: {event.environment}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Organizador: {event.organizer}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Recursos: {event.resourcesDescription?.join(", ")}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Forma de Divulgação: {event.disclosureMethod}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Disciplinas Relacionados: {event.relatedSubjects?.join(", ")}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Estratégia de Ensino: {event.teachingStrategy}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Autores: {event.authors?.join(", ")}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Cursos: {event.courses?.join(", ")}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Vínculo Disciplinar: {event.disciplinaryLink}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Local: {event.location?.name} ({event.location?.floor})</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Status: {event.status}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Status Administrativo: {event.administrativeStatus}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Prioridade: {event.priority}</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Duração da Limpeza: {event.cleanupDuration} minutos</Text>
      <Text style={[styles.detail, { color: themeColors.cardText }]}>Observação: {event.observation}</Text>
    </View>
  );


 return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Text style={[styles.header, { color: themeColors.primary }]}>Conflito de Eventos</Text>

      {renderEventDetails(existingEvent, "Evento Existente")}
      {renderEventDetails(newEvent, "Novo Evento")}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.replaceButton]}
          onPress={handleReplace}
        >
          <Text style={[styles.buttonText, { color: themeColors.statusText }]}>Substituir Evento</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { color: themeColors.statusText }]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ConflictResolutionScreen;
