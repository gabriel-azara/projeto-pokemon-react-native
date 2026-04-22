export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonResult {
  name: string;
  url: string;
  types?: PokemonType[];
}

export interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonResult[];
}
