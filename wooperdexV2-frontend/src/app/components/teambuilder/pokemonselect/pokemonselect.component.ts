// pokemonselect.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BuilderStore } from '../../../builder.store';
import { BuilderService } from '../../../builder.service';
import { Pokemon, BaseStats } from '../../../models';
import { POKEMON_TYPES, POKEMON_TIERS, ALL_POKEMON_TIERS, TIER_GROUPS } from '../../../constants';
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
  
  // Displayed columns for mat-table
  displayedColumns: string[] = ['tier', 'pokemon', 'type', 'abilities', 'hp', 'atk', 'def', 'spa', 'spd', 'spe', 'bst'];
  
  // Filtering options
  selectedType: string | null = null;
  selectedTier: string | null = null;
  
  
  types: string[] = POKEMON_TYPES;
  tiers: string[] = POKEMON_TIERS;
  allTiers: string[] = ALL_POKEMON_TIERS;
  tierGroups: { [key: string]: string[] } = TIER_GROUPS;
  
  ngOnInit(): void {
    // Load Pokemon list from store
    this.store.pokedex$.subscribe(pokedex => {
      
      this.pokemonList = this.sortPokemonList(pokedex);
      this.filteredPokemonList = [...this.pokemonList]; // Copy the list to avoid modifying the original
    });
    
    // Set up search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.applyFilters();
    });
  }
  
  // Sort Pokemon by tier and then alphabetically
  sortPokemonList(pokemonList: Pokemon[]): Pokemon[] {
    // Define tier order for sorting
    const tierOrder: { [key: string]: number } = {};
    
    // Assign numbers to tiers based on their position in ALL_POKEMON_TIERS
    this.allTiers.forEach((tier, index) => {
      tierOrder[tier] = index + 1;
    });
    
    // Add 'Illegal' tier with a high number to place it at the end
    tierOrder['Illegal'] = 99;
    
    return [...pokemonList].sort((a, b) => {
      // First sort by tier
      const tierA = a.tier || 'Illegal';
      const tierB = b.tier || 'Illegal';
      
      const tierCompare = (tierOrder[tierA] || 99) - (tierOrder[tierB] || 99);
      
      // If tiers are the same, sort alphabetically by name
      if (tierCompare === 0) {
        return a.name.localeCompare(b.name);
      }
      
      return tierCompare;
    });
  }
  
  selectPokemon(pokemon: Pokemon): void {
    // Convert Pokemon to BuiltPokemon
    const builtPokemon = this.builderService.mapPokemonToBuiltPokemon(pokemon);
    
    // Set the selected Pokemon in the store
    this.store.updateCurrentPokemon(builtPokemon);
    
    // Also fetch and set the learnset for this Pokemon
    this.builderService.getLearnset(pokemon.id).subscribe(learnset => {
      this.store.updateCurrentLearnset(learnset);
    });
    
    // Navigate to ability selection
    this.router.navigate(['/teambuilder/item']);
  }
  
  applyFilters(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    
    this.filteredPokemonList = this.pokemonList.filter(pokemon => {
      // Apply search filter
      const matchesSearch = searchTerm ? 
        pokemon.name.toLowerCase().includes(searchTerm) || 
        pokemon.id.toLowerCase().includes(searchTerm) ||
        pokemon.num.toString().includes(searchTerm) : 
        true;
      
      // Apply type filter
      const matchesType = this.selectedType ? 
        pokemon.types.some(type => type.toLowerCase() === this.selectedType?.toLowerCase()) : 
        true;
      
      // Apply tier filter - now using tier groups
      const matchesTier = this.selectedTier ? 
        this.isInTierGroup(pokemon.tier, this.selectedTier) : 
        pokemon.tier !== 'Illegal'; // Filter out illegal Pokemon by default
      
      return matchesSearch && matchesType && matchesTier;
    });
  }
  
  // Helper method to check if a Pokemon's tier belongs to a selected tier group
  isInTierGroup(pokemonTier: string | undefined, selectedTier: string): boolean {
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