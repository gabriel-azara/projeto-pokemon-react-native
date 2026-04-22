import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PokemonResult } from '../types/pokemon';

const FAVORITES_KEY = '@pokemon_favorites';

interface FavoritesContextData {
  favorites: PokemonResult[];
  toggleFavorite: (pokemon: PokemonResult) => Promise<void>;
  isFavorite: (name: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export const FavoritesProvider = ({ children }: { children: ReactNode }): React.ReactElement => {
  const [favorites, setFavorites] = useState<PokemonResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (pokemon: PokemonResult) => {
    try {
      const isFav = favorites.some((fav) => fav.name === pokemon.name);
      let newFavorites;
      
      if (isFav) {
        newFavorites = favorites.filter((fav) => fav.name !== pokemon.name);
      } else {
        newFavorites = [...favorites, pokemon];
      }
      
      setFavorites(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed to save favorite', e);
    }
  };

  const isFavorite = (name: string) => {
    return favorites.some((fav) => fav.name === name);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

