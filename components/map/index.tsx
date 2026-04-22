import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Pin {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

const MapComponent = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [randomPins, setRandomPins] = useState<Pin[]>([]);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView>(null);

  // Função para gerar coordenadas aleatórias num raio de ~2-3km
  const generateRandomPins = (centerLat: number, centerLng: number, count: number = 5): Pin[] => {
    const pins: Pin[] = [];
    for (let i = 0; i < count; i++) {
      // 1 grau lat/lng ~ 111km. 0.04 graus ~ 4.4km
      const latOffset = (Math.random() - 0.5) * 0.04;
      const lngOffset = (Math.random() - 0.5) * 0.04;
      pins.push({
        id: `pin-${i}-${Date.now()}`,
        coordinate: {
          latitude: centerLat + latOffset,
          longitude: centerLng + lngOffset,
        },
      });
    }
    return pins;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização foi negada.');
        setLoading(false);
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setCurrentRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        
        // Gerar 10 pins baseado na localização inicial
        const pins = generateRandomPins(
          currentLocation.coords.latitude, 
          currentLocation.coords.longitude, 
          10
        );
        setRandomPins(pins);
      } catch (e) {
        setErrorMsg('Não foi possível obter a localização. Verifique o GPS do emulador.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Foca num pin aleatório quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      if (randomPins.length > 0 && mapRef.current) {
        const randomIndex = Math.floor(Math.random() * randomPins.length);
        const selectedPin = randomPins[randomIndex];
        
        // Timeout pequeno para garantir que o mapa e a tab terminaram de renderizar
        setTimeout(() => {
          mapRef.current?.animateToRegion({
            latitude: selectedPin.coordinate.latitude,
            longitude: selectedPin.coordinate.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000); // 1 segundo de animação (zoom suave)
        }, 500);
      }
    }, [randomPins])
  );

  const handleCenterLocation = () => {
    if (location && mapRef.current) {
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(newRegion, 1000);
      setCurrentRegion(newRegion);
    }
  };

  const handleZoomIn = () => {
    if (currentRegion && mapRef.current) {
      const newRegion = {
        ...currentRegion,
        latitudeDelta: currentRegion.latitudeDelta / 2,
        longitudeDelta: currentRegion.longitudeDelta / 2,
      };
      mapRef.current.animateToRegion(newRegion, 500);
      setCurrentRegion(newRegion);
    }
  };

  const handleZoomOut = () => {
    if (currentRegion && mapRef.current) {
      const newRegion = {
        ...currentRegion,
        latitudeDelta: currentRegion.latitudeDelta * 2,
        longitudeDelta: currentRegion.longitudeDelta * 2,
      };
      mapRef.current.animateToRegion(newRegion, 500);
      setCurrentRegion(newRegion);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Obtendo localização...</Text>
      </View>
    );
  }

  if (errorMsg || !location) {
    const fallbackLat = -15.7801;
    const fallbackLng = -47.9292;
    
    return (
      <View style={styles.container}>
        <MapView 
          ref={mapRef}
          style={styles.map} 
          initialRegion={{
            latitude: fallbackLat,
            longitude: fallbackLng,
            latitudeDelta: 10,
            longitudeDelta: 10,
          }}
        />
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>{errorMsg || "Localização indisponível"}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={(region) => setCurrentRegion(region)}
        showsUserLocation={true} // Marca azul nativa
      >
        {/* Marcador Customizado para o Usuário (fallback se o showsUserLocation do iOS falhar no emulador sem permissão correta) */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Você está aqui"
          pinColor="blue"
        />

        {/* Pins Aleatórios */}
        {randomPins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={pin.coordinate}
            title="Pokémon Selvagem!"
            description="Um Pokémon selvagem apareceu!"
            pinColor="red"
          />
        ))}
      </MapView>

      {location && (
        <TouchableOpacity style={styles.locationButton} onPress={handleCenterLocation}>
          <FontAwesome name="location-arrow" size={24} color="#007BFF" />
        </TouchableOpacity>
      )}

      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
          <FontAwesome name="plus" size={20} color="#666" />
        </TouchableOpacity>
        <View style={styles.zoomSeparator} />
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
          <FontAwesome name="minus" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  errorText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 95,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  zoomButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomSeparator: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
  },
});

export default MapComponent;
