import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Ability, BuiltPokemon, Item, Learnset, Move, Pokemon, Trainer } from "./models";

export interface Pokedex {
    pokedex: Pokemon[];  
}

export interface Itemlist {
    itemlist: Item[];
}

export interface Movelist {
    movelist: Move[];
}

export interface Abilitieslist {
    abilitylist: Ability[];
}

export interface BuilderState {
    pokedex: Pokemon[];
    itemlist: Item[];
    movelist: Move[];
    abilitylist: Ability[];
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
            itemlist: [],
            movelist: [],
            abilitylist: [],
            currentPokemon: null,
            currentLearnset: null,
            currentTrainer: null 
        });
    }

    // selectors
    readonly pokedex$ = this.select(state => state.pokedex);
    readonly itemlist$ = this.select(state => state.itemlist);
    readonly movelist$ = this.select(state => state.movelist);
    readonly abilitylist$ = this.select(state => state.abilitylist);
    readonly currentPokemon$ = this.select(state => state.currentPokemon);
    readonly currentLearnset$ = this.select(state => state.currentLearnset);
    readonly currentTrainer$ = this.select(state => state.currentTrainer);

    // updaters
    readonly setPokedex = this.updater((state, pokedex: Pokemon[]) => {
        return { 
            ...state,
            pokedex: pokedex
        };
    });

    readonly setMoves = this.updater((state, moves: Move[]) => {
        return { 
            ...state,
            movelist: moves
        };
    });

    readonly setItems = this.updater((state, items: Item[]) => {
        return { 
            ...state,
            itemlist: items
        };
    });

    readonly setAbilities = this.updater((state, abilities: Ability[]) => {
        return { 
            ...state,
            abilitylist: abilities
        };
    });

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