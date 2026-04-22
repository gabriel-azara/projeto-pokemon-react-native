import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";

const POKEMON_TYPES = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];

interface TypeFilterProps {
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
}

export default function TypeFilter({
  selectedType,
  onSelectType,
}: TypeFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <TouchableOpacity
          style={[styles.badge, selectedType === null && styles.badgeSelected]}
          onPress={() => onSelectType(null)}
        >
          <Text
            style={[styles.text, selectedType === null && styles.textSelected]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {POKEMON_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.badge,
              selectedType === type && styles.badgeSelected,
            ]}
            onPress={() => onSelectType(type)}
          >
            <Text
              style={[
                styles.text,
                selectedType === type && styles.textSelected,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  scrollContainer: {
    paddingBottom: 5,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  badgeSelected: {
    backgroundColor: "#007BFF",
    borderColor: "#0056b3",
  },
  text: {
    fontSize: 14,
    color: "#555",
    textTransform: "capitalize",
    fontWeight: "500",
  },
  textSelected: {
    color: "#fff",
  },
});
