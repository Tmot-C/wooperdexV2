// pokemonselect.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { BuilderStore } from '../../../builder.store';
import { BuilderService } from '../../../builder.service';
import { Pokemon, BaseStats } from '../../../models';
import {
  POKEMON_TYPES,
  POKEMON_TIERS,
  ALL_POKEMON_TIERS,
  TIER_GROUPS,
} from '../../../constants';
import { ImagePathService } from '../../../image-path.service';

@Component({
  selector: 'app-pokemonselect',
  standalone: false,
  templateUrl: './pokemonselect.component.html',
  styleUrls: ['./pokemonselect.component.scss'],
})
export class PokemonselectComponent implements OnInit {
  private store = inject(BuilderStore);
  private builderService = inject(BuilderService);
  private router = inject(Router);
  public imageService = inject(ImagePathService);

  searchControl = new FormControl('');
  pokemonList: Pokemon[] = [];
  filteredPokemonList: Pokemon[] = [];

  displayedColumns: string[] = [
    'tier',
    'pokemon',
    'type',
    'abilities',
    'hp',
    'atk',
    'def',
    'spa',
    'spd',
    'spe',
    'bst',
  ];

  // Filtering yet again
  selectedType: string | null = null;
  selectedTier: string | null = null;

  types: string[] = POKEMON_TYPES;
  tiers: string[] = POKEMON_TIERS;
  allTiers: string[] = ALL_POKEMON_TIERS;
  tierGroups: { [key: string]: string[] } = TIER_GROUPS;

  ngOnInit(): void {
    // Log the current navigation context
    this.store.currentTeamIndex$.pipe(take(1)).subscribe((index) => {
      console.log('Team builder context - Current team index:', index);
    });

    this.store.editExistingTeam$.pipe(take(1)).subscribe((isEditing) => {
      console.log('Team builder context - Editing existing team:', isEditing);
    });

    this.store.pokedex$.subscribe((pokedex) => {
      this.pokemonList = this.sortPokemonList(pokedex);
      this.filteredPokemonList = [...this.pokemonList];
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.applyFilters();
      });
  }

  sortPokemonList(pokemonList: Pokemon[]): Pokemon[] {
    const tierOrder: { [key: string]: number } = {};

    // Rank the tiers for ordering
    this.allTiers.forEach((tier, index) => {
      tierOrder[tier] = index + 1;
    });

    tierOrder['Illegal'] = 99;

    return [...pokemonList].sort((a, b) => {
      const tierA = a.tier || 'Illegal';
      const tierB = b.tier || 'Illegal';

      const tierCompare = (tierOrder[tierA] || 99) - (tierOrder[tierB] || 99);

      // Alphabetical order within the same tier
      if (tierCompare === 0) {
        return a.name.localeCompare(b.name);
      }

      return tierCompare;
    });
  }

  selectPokemon(pokemon: Pokemon): void {
    // Convert Pokemon to BuiltPokemon
    const builtPokemon = this.builderService.mapPokemonToBuiltPokemon(pokemon);

    // Set pokemon in state
    this.store.updateCurrentPokemon(builtPokemon);

    // Get learnset
    this.builderService.getLearnset(pokemon.id).subscribe((learnset) => {
      this.store.updateCurrentLearnset(learnset);
    });

    this.router.navigate(['/teambuilder/item']);
  }

  applyFilters(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';

    this.filteredPokemonList = this.pokemonList.filter((pokemon) => {
      const matchesSearch = searchTerm
        ? pokemon.name.toLowerCase().includes(searchTerm) ||
          pokemon.id.toLowerCase().includes(searchTerm) ||
          pokemon.num.toString().includes(searchTerm)
        : true;

      const matchesType = this.selectedType
        ? pokemon.types.some(
            (type) => type.toLowerCase() === this.selectedType?.toLowerCase()
          )
        : true;

      const matchesTier = this.selectedTier
        ? this.isInTierGroup(pokemon.tier, this.selectedTier)
        : pokemon.tier !== 'Illegal';

      return matchesSearch && matchesType && matchesTier;
    });
  }

  // Helper method to check if a Pokemon's tier belongs to a selected tier group
  isInTierGroup(
    pokemonTier: string | undefined,
    selectedTier: string
  ): boolean {
    if (!pokemonTier) return false;

    // If the tier group exists, check if the Pokemon's tier is in that group
    if (this.tierGroups[selectedTier]) {
      return this.tierGroups[selectedTier].includes(pokemonTier);
    }

    // Direct comparison if no group defined
    return pokemonTier === selectedTier;
  }

  setTypeFilter(type: string | null): void {
    this.selectedType = type;
    this.applyFilters();
  }

  setTierFilter(tier: string | null): void {
    this.selectedTier = tier;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.selectedType = null;
    this.selectedTier = null;
    this.applyFilters();
  }

  getTypeClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }

  // Calculate Base Stat Total (BST)
  calculateBST(stats: BaseStats): number {
    return stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;
  }
}
