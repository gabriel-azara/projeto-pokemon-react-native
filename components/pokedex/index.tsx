import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  usePokemons,
  useSearchPokemon,
  usePokemonsByType,
} from "../../hooks/usePokemons";
import { PokemonResult } from "../../types/pokemon";
import SearchBar from "./SearchBar";
import TypeFilter from "./TypeFilter";
import PokemonCard from "../PokemonCard";

const Pokelist = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const {
    data: infiniteData,
    isLoading: isLoadingInfinite,
    isError: isErrorInfinite,
    error: errorInfinite,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePokemons();

  const {
    data: searchData,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    error: errorSearch,
  } = useSearchPokemon(searchQuery);

  const {
    data: typeData,
    isLoading: isLoadingType,
    isError: isErrorType,
    error: errorType,
    fetchNextPage: fetchNextPageType,
    hasNextPage: hasNextPageType,
    isFetchingNextPage: isFetchingNextPageType,
  } = usePokemonsByType(selectedType);

  let displayData: PokemonResult[] = [];
  let isLoading = false;
  let isError = false;
  let errorMessage = "";

  if (searchQuery) {
    displayData = searchData ? [searchData] : [];
    isLoading = isLoadingSearch;
    isError = isErrorSearch;
    errorMessage = errorSearch?.message || "Erro na busca";
  } else if (selectedType) {
    displayData = typeData?.pages.flatMap((page) => page.results) || [];
    isLoading = isLoadingType;
    isError = isErrorType;
    errorMessage = errorType?.message || "Erro ao buscar tipo";
  } else {
    displayData = infiniteData?.pages.flatMap((page) => page.results) || [];
    isLoading = isLoadingInfinite;
    isError = isErrorInfinite;
    errorMessage = errorInfinite?.message || "Erro ao carregar";
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedType(null);
  };

  const handleSelectType = (type: string | null) => {
    setSelectedType(type);
    if (type) setSearchQuery("");
  };

  const renderFooter = () => {
    if (searchQuery) return null;

    const isTypeFilter = !!selectedType;
    const canLoadMore = isTypeFilter ? hasNextPageType : hasNextPage;
    const isFetchingMore = isTypeFilter ? isFetchingNextPageType : isFetchingNextPage;
    const doFetchNextPage = isTypeFilter ? fetchNextPageType : fetchNextPage;

    if (!canLoadMore) return null;

    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={() => doFetchNextPage()}
        disabled={isFetchingMore}
      >
        {isFetchingMore ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loadMoreText}>Carregar mais</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerFlex}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerFlex}>
          <Text style={styles.errorText}>
            {searchQuery && isErrorSearch
              ? `Pokémon "${searchQuery}" não encontrado.`
              : `Erro: ${errorMessage}`}
          </Text>
        </View>
      );
    }

    if (displayData.length === 0) {
      return (
        <View style={styles.centerFlex}>
          <Text style={styles.emptyText}>Nenhum Pokémon encontrado.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={displayData}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    );
  };

  return (
    <View style={styles.container}>      
      <SearchBar onSearch={handleSearch} onClear={() => setSearchQuery("")} />
      
      {!searchQuery && (
        <TypeFilter selectedType={selectedType} onSelectType={handleSelectType} />
      )}

      {renderContent()}
    </View>
  );
};

export default Pokelist;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4F4F5",
    flex: 1,
    width: "100%",
    padding: 15,
    paddingTop: 30,
  },
  centerFlex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  loadMoreButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  loadMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
