import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  Ability,
  BuiltPokemon,
  Item,
  Learnset,
  Move,
  Pokemon,
  Team,
  Trainer,
} from './models';

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
  currentTeam: BuiltPokemon[] | null;
  currentTeamIndex: number;
  currentLearnset: Learnset | null;
  currentTrainer: Trainer | null;
  addToExistingTeam: boolean;
  editingPokemonIndex: number;
}

@Injectable({
  providedIn: 'root',
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
      currentTeam: null,
      currentTeamIndex: 0,
      currentTrainer: null,
      addToExistingTeam: false,
      editingPokemonIndex: 0,
    });
  }

  // selectors
  readonly pokedex$ = this.select((state) => state.pokedex);
  readonly itemlist$ = this.select((state) => state.itemlist);
  readonly movelist$ = this.select((state) => state.movelist);
  readonly abilitylist$ = this.select((state) => state.abilitylist);
  readonly currentPokemon$ = this.select((state) => state.currentPokemon);
  readonly currentTeam$ = this.select((state) => state.currentTeam);
  readonly currentTeamIndex$ = this.select((state) => state.currentTeamIndex);
  readonly currentLearnset$ = this.select((state) => state.currentLearnset);
  readonly currentTrainer$ = this.select((state) => state.currentTrainer);
  readonly addToExistingTeam$ = this.select((state) => state.addToExistingTeam);
  readonly editingPokemonIndex$ = this.select(
    (state) => state.editingPokemonIndex
  );

  // updaters
  readonly setPokedex = this.updater((state, pokedex: Pokemon[]) => {
    return {
      ...state,
      pokedex: pokedex,
    };
  });

  readonly setMoves = this.updater((state, moves: Move[]) => {
    return {
      ...state,
      movelist: moves,
    };
  });

  readonly setItems = this.updater((state, items: Item[]) => {
    return {
      ...state,
      itemlist: items,
    };
  });

  readonly setAbilities = this.updater((state, abilities: Ability[]) => {
    return {
      ...state,
      abilitylist: abilities,
    };
  });

  readonly updateCurrentPokemon = this.updater(
    (state, pokemon: BuiltPokemon) => {
      return {
        ...state,
        currentPokemon: pokemon,
      };
    }
  );

  readonly updateCurrentLearnset = this.updater((state, learnset: Learnset) => {
    return {
      ...state,
      currentLearnset: learnset,
    };
  });

  readonly loadTeam = this.updater((state, team: BuiltPokemon[]) => {
    return {
      ...state,
      currentTeam: team,
    };
  });
  readonly setCurrentTeamIndex = this.updater((state, index: number) => {
    return {
      ...state,
      currentTeamIndex: index,
    };
  });

  readonly updateCurrentTrainer = this.updater((state, trainer: Trainer) => {
    return {
      ...state,
      currentTrainer: trainer,
    };
  });

  readonly setAddToExistingTeam = this.updater((state, value: boolean) => {
    return { ...state, addToExistingTeam: value };
  });

  readonly setEditingPokemonIndex = this.updater((state, index: number) => {
    return {
      ...state,
      editingPokemonIndex: index,
    };
  });

  // New updater to add the current Pokémon to the team
  readonly addPokemonToTeam = this.updater((state) => {
    // If there's no current Pokémon, return state unchanged
    if (!state.currentPokemon) {
      return state;
    }

    // Create a new team array, initializing it if it's null
    const updatedTeam = state.currentTeam
      ? [...state.currentTeam, state.currentPokemon]
      : [state.currentPokemon];

    return {
      ...state,
      currentTeam: updatedTeam,
    };
  });

  // Optional: Remove a Pokémon from the team at a specific index
  readonly removePokemonFromTeam = this.updater((state, index: number) => {
    // If there's no team, return state unchanged
    if (!state.currentTeam) {
      return state;
    }

    // Ensure index is within bounds
    if (index < 0 || index >= state.currentTeam.length) {
      return state;
    }

    // Create a new team array without the Pokémon at the specified index
    const updatedTeam = state.currentTeam.filter((_, i) => i !== index);

    return {
      ...state,
      currentTeam: updatedTeam.length > 0 ? updatedTeam : null,
    };
  });

  readonly saveTeamToTrainer = this.updater((state) => {
    // If there's no current team or trainer, return state unchanged
    if (!state.currentTeam || !state.currentTrainer) {
      console.warn('Cannot save team: No current team or trainer found');
      return state;
    }

    // Create a new Team object
    const newTeam: Team = {
      team: state.currentTeam,
    };

    // Copy the trainer's teams array or initialize if it doesn't exist
    const existingTeams = state.currentTrainer.teams || [];

    console.log('Current team index:', state.currentTeamIndex);
    console.log('Existing teams length:', existingTeams.length);

    let updatedTeams: Team[];

    // Check if we're updating an existing team or adding a new one
    if (
      state.currentTeamIndex > 0 &&
      state.currentTeamIndex <= existingTeams.length
    ) {
      // Update existing team
      console.log(
        'Updating existing team at index:',
        state.currentTeamIndex - 1
      );
      updatedTeams = [...existingTeams];
      updatedTeams[state.currentTeamIndex - 1] = newTeam;
    } else {
      // Add new team
      console.log('Adding new team');
      updatedTeams = [...existingTeams, newTeam];
    }

    // Create a new trainer object with the updated teams
    const updatedTrainer: Trainer = {
      ...state.currentTrainer,
      teams: updatedTeams,
    };

    console.log('Updated trainer teams count:', updatedTrainer!.teams!.length);

    // Return the updated state with the new trainer
    return {
      ...state,
      currentTrainer: updatedTrainer,
    };
  });

  readonly resetCurrents = this.updater((state) => {
    return {
      ...state,
      currentPokemon: null,
      currentTeam: null,
      currentTeamIndex: 0,
      currentLearnset: null,
      currentTrainer: null,
      editingPokemonIndex: -1, // Reset this as well
      addToExistingTeam: false, // Reset this flag too
    };
  });

  readonly deleteTeamFromTrainer = this.updater((state, teamIndex: number) => {
    if (!state.currentTrainer || !state.currentTrainer.teams) {
      console.warn(
        'Cannot delete team: No trainer data found or no teams exist'
      );
      return state;
    }

    if (teamIndex <= 0 || teamIndex > state.currentTrainer.teams.length) {
      console.warn('Cannot delete team: Invalid team index:', teamIndex);
      return state;
    }

    const updatedTeams = [...state.currentTrainer.teams];
    updatedTeams.splice(teamIndex - 1, 1); // Adjust index for 0-based array

    console.log('Deleted team at index:', teamIndex - 1);
    console.log('Updated teams count:', updatedTeams.length);

    const updatedTrainer: Trainer = {
      ...state.currentTrainer,
      teams: updatedTeams,
    };

    return {
      ...state,
      currentTrainer: updatedTrainer,
    };
  });
}
