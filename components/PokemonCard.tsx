import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PokemonResult } from '../types/pokemon';
import { useFavorites } from '../hooks/useFavorites';

interface PokemonCardProps {
  pokemon: PokemonResult;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Extrair o ID da URL da PokeAPI (ex: https://pokeapi.co/api/v2/pokemon/25/ -> 25)
  const id = pokemon.url.split("/").filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <View style={styles.card}>
      <Text style={styles.idText}>#{id}</Text>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{pokemon.name}</Text>
        <View style={styles.typesContainer}>
          {pokemon.types?.map((t: any) => (
            <View key={t.type.name} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.favoriteContainer}>
        <TouchableOpacity onPress={() => toggleFavorite(pokemon)}>
          <FontAwesome
            name={isFavorite(pokemon.name) ? "heart" : "heart-o"}
            size={24}
            color={isFavorite(pokemon.name) ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  idText: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "500",
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 15,
    marginLeft: 5,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "500",
  },
  typesContainer: {
    flexDirection: "row",
    marginTop: 5,
    gap: 5,
    flexWrap: "wrap",
  },
  typeBadge: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    color: "#333",
    textTransform: "capitalize",
  },
  favoriteContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 15,
  },
});
