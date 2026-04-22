import { StyleSheet, Text, View, FlatList } from "react-native";
import { useFavorites } from "../../hooks/useFavorites";
import PokemonCard from "../PokemonCard";

const FavoritesList = () => {
  const { favorites } = useFavorites();

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum Pokémon favoritado</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.name}
          style={styles.list}
          renderItem={({ item }) => <PokemonCard pokemon={item} />}
        />
      )}
    </View>
  );
};

export default FavoritesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F5",
    width: "100%",
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  list: {
    width: "100%",
  },
});
