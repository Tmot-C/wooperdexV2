import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { BuiltPokemon, Item, Learnset, Pokemon, Trainer } from "./models";

export interface Pokedex {
    pokedex: Pokemon[];  
}

export interface Itemlist{
    items: Item[];
}

export interface Moveslist{
    items: Item[];
}

export interface Abilitieslist{
    items: Item[];
}

export interface BuilderState {
    pokedex: Pokemon[];
    items: Item[];
    moves: Item[];
    abilities: Item[];
    currentPokemon: BuiltPokemon;
    currentLearnset: Learnset
    currentTrainer: Trainer;
}



@Injectable({
  providedIn: 'root'
})
export class BuilderStore extends ComponentStore<any> {

}