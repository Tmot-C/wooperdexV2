export interface BaseStats {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  }

export interface Item {
    id: string;
    name: string;
    num: number;
    shortDesc: string;
    category: string;
    itemUser: string[]| null;
}

export interface Learnset {
    moves: string[];
}

export interface Move {
    id: string;
    name: string;
    num: number;
    type: string;
    category: string;
    basePower: number;
    accuracy: string;
    pp: number;
    shortDesc: string | null;
}

export interface Ability {
    id: string;
    name: string;
    rating: number;
    num: number;
    shortDesc: string;
}

export interface Pokemon {
    id: string;
    num: number;
    name: string;
    types: string[];
    baseStats: BaseStats;
    abilities: string[];
    tier: string;
}

export interface BuiltPokemon {
    id: string | null; //basically the pokemon's name in lowercase with no special characters, used as the general identifier
    num: number | null;//dex number
    name: string | null;
    types: string[] | null;
    baseStats: BaseStats | null;
    abilities: string[] | null;
    chosenAbility: string | null;
    move1: string | null;
    move2: string | null;
    move3: string | null;
    move4: string | null;
    item: string | null;
    nature: string | null;
    evs: BaseStats | null;//reusing the BaseStats interface
    ivs: BaseStats | null;
}

export interface Team {
    team: BuiltPokemon[];
}

export interface Trainer {
    firebaseId: string;
    email: string;
    name: string | null
    teams: Team[] | null;

}

export interface User {
    email: string;
    name: string | null;
    password: string;
}