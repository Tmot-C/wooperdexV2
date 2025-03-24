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

    //selectors
    readonly pokedex$ = this.select(state => state.pokedex);
    readonly items$ = this.select(state => state.items);
    readonly moves$ = this.select(state => state.moves);
    readonly abilities$ = this.select(state => state.abilities);
    readonly currentPokemon$ = this.select(state => state.currentPokemon);
    readonly currentLearnset$ = this.select(state => state.currentLearnset);
    readonly currentTrainer$ = this.select(state => state.currentTrainer);

    //updaters
    readonly updateCurrentPokemon = this.updater((state, pokemon: BuiltPokemon) => {
        return {
            ...state,
            currentPokemon: pokemon
        };
    });

    readonly updateCurrentLearnset = this.updater((state, learnset: Learnset) => {
        return {
            ...state,
            currentLearnset: learnset
        };
    });

    readonly updateCurrentTrainer = this.updater((state, trainer: Trainer) => {
        return {
            ...state,
            currentTrainer: trainer
        };
    });
    
}