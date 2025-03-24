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
    currentPokemon: BuiltPokemon | null;
    currentLearnset: Learnset | null;
    currentTrainer: Trainer | null;
}

@Injectable({
  providedIn: 'root'
})
export class BuilderStore extends ComponentStore<BuilderState> {

    constructor() {
        super({
            pokedex: [],
            items: [],
            moves: [],
            abilities: [],
            currentPokemon: null,
            currentLearnset: null,
            currentTrainer: null 
        });
    }
}