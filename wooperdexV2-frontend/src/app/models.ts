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
    id: string; //basically the pokemon's name in lowercase with no special characters, used as the general identifier
    num: number;//dex number
    name: string;
    types: string[];
    baseStats: BaseStats;
    abilities: string[];
    chosenAbility: string;
    move1: string;
    move2: string;
    move3: string;
    move4: string;
    item?: string;
    nature: string;
    evs: BaseStats;//reusing the BaseStats interface
    ivs: BaseStats;
}

export interface Team {
    teamName: string;
    team: BuiltPokemon[];
}

export interface Trainer {
    email: string;
    name: string | null
    teams: Team[] | null;

}

export interface User {
    email: string;
    name: string | null;
    password: string;
}