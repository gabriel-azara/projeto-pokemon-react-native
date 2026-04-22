import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { PokemonResult, PokemonApiResponse } from "../types/pokemon";

export const usePokemons = () => {
  return useInfiniteQuery({
    queryKey: ["pokemons"],
    initialPageParam: "https://pokeapi.co/api/v2/pokemon?limit=20",
    queryFn: async ({ pageParam }): Promise<PokemonApiResponse> => {
      const response = await fetch(pageParam);
      if (!response.ok) {
        throw new Error("Failed to fetch pokemons");
      }
      const data = await response.json();

      const detailedResults = await Promise.all(
        data.results.map(async (pokemon: PokemonResult) => {
          const detailResponse = await fetch(pokemon.url);
          const detailData = await detailResponse.json();
          return {
            ...pokemon,
            types: detailData.types,
          };
        })
      );

      return {
        ...data,
        results: detailedResults,
      };
    },
    getNextPageParam: (lastPage) => lastPage.next,
  });
};

export const useSearchPokemon = (name: string) => {
  return useQuery({
    queryKey: ["pokemon", name],
    queryFn: async (): Promise<PokemonResult> => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!response.ok) {
        throw new Error("Pokemon not found");
      }
      const data = await response.json();
      
      // Padronizar com a estrutura da lista
      return {
        name: data.name,
        url: `https://pokeapi.co/api/v2/pokemon/${data.id}/`,
        types: data.types,
      };
    },
    enabled: !!name,
    retry: false, // Não tentar de novo se não encontrar
  });
};

export const usePokemonsByType = (type: string | null) => {
  return useInfiniteQuery({
    queryKey: ["pokemonsByType", type],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }): Promise<{ results: PokemonResult[], next: number | null }> => {
      if (!type) return { results: [], next: null };
      
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      if (!response.ok) {
        throw new Error("Failed to fetch type");
      }
      const data = await response.json();
      
      const pageSize = 20;
      const allPokemons = data.pokemon.map((p: any) => p.pokemon);
      const paginatedPokemons = allPokemons.slice(pageParam * pageSize, (pageParam + 1) * pageSize);
      
      const detailedResults = await Promise.all(
        paginatedPokemons.map(async (pokemon: PokemonResult) => {
          try {
            const detailResponse = await fetch(pokemon.url);
            const detailData = await detailResponse.json();
            return {
              ...pokemon,
              types: detailData.types,
            };
          } catch (e) {
            return pokemon;
          }
        })
      );
      
      const hasNextPage = (pageParam + 1) * pageSize < allPokemons.length;
      
      return {
        results: detailedResults,
        next: hasNextPage ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.next,
    enabled: !!type,
  });
};
