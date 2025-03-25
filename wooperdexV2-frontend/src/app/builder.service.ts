import { HttpClient } from "@angular/common/http";
import {Injectable, inject} from "@angular/core";
import {Observable} from "rxjs";
import { Ability, BuiltPokemon, Item, Learnset, Move, Pokemon, Trainer } from "./models";

@Injectable({
    providedIn: 'root'
  })
export class BuilderService{

    private http = inject(HttpClient);

    getPokedex(): Observable<Pokemon[]> {
        return this.http.get<Pokemon[]>('/api/pokedex')
    }
    getMoves(): Observable<Move[]> {
        return this.http.get<Move[]>('/api/moves')
    }
    getAbilities(): Observable<Ability[]> {
        return this.http.get<Ability[]>('/api/abilities')
    }
    getItems(): Observable<Item[]> {
        return this.http.get<Item[]>('/api/items')  
    }
    getLearnset(id: string): Observable<Learnset> {
        return this.http.get<Learnset>(`/api/learnset/${id}`)
    }
    getTrainer(id: string): Observable<Trainer> {
        return this.http.get<Trainer>(`/api/trainer/${id}`)
    }

    getPokemonAnalysis(pokemon: string): Observable<string> {
        return this.http.post(`/pokemon-analysis/${pokemon}`, { pokemon }, { responseType: 'text' });
    }


    mapPokemonToBuiltPokemon(pokemon: Pokemon): BuiltPokemon {
        return {
          id: pokemon.id,
          num: pokemon.num,
          name: pokemon.name,
          types: pokemon.types,
          baseStats: pokemon.baseStats,
          abilities: pokemon.abilities,
          // extra fields that don't exist in Pokemon are set to null
          chosenAbility: null,
          move1: null,
          move2: null,
          move3: null,
          move4: null,
          item: null,
          nature: null,
          evs: null,
          ivs: null,
        };
      }

}