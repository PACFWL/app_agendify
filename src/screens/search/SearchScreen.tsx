import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { searchEvents } from "../../api/event";

type Event = {
    id: string;
    name: string;
    day: string;
  };
  

const SearchScreen = () => {
  const auth = useContext(AuthContext);
  const [name, setName] = useState("");
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchEvents(auth?.user?.token || "", { name });
      setResults(data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Eventos</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do evento"
        value={name}
        onChangeText={setName}
      />
      <Button title="Buscar" onPress={handleSearch} />

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventTitle}>{item.name}</Text>
              <Text>{item.day}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 22, marginBottom: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  },
  eventItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  eventTitle: {
    fontWeight: "bold",
  },
});

export default SearchScreen;
