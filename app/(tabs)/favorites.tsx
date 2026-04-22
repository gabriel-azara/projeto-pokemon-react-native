import FavoritesList from "@/components/favorites";
import { StyleSheet, View } from "react-native";

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <FavoritesList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
