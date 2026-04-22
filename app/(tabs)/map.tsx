import { StyleSheet, View } from "react-native";
import MapComponent from "../../components/map";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
