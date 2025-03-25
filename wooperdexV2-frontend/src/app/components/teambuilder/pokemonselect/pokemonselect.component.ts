// pokemonselect.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BuilderStore } from '../../../builder.store';
import { BuilderService } from '../../../builder.service';
import { Pokemon, BaseStats } from '../../../models';

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
  
  searchControl = new FormControl('');
  pokemonList: Pokemon[] = [];
  filteredPokemonList: Pokemon[] = [];
  
  // Displayed columns for mat-table
  displayedColumns: string[] = ['tier', 'pokemon', 'type', 'abilities', 'hp', 'atk', 'def', 'spa', 'spd', 'spe', 'bst'];
  
  // Filtering options
  selectedType: string | null = null;
  selectedTier: string | null = null;
  
  // List of available types and tiers for filtering
  types: string[] = [
    'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice',
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic',
    'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
  ];
  
  tiers: string[] = [
    'Uber', 'OU', 'UU', 'RU', 'NU', 'PU', 'LC'
  ];
  
  ngOnInit(): void {
    // Load Pokemon list from store
    this.store.pokedex$.subscribe(pokedex => {
      // Sort the Pokemon list by tier first, then alphabetically by name
      this.pokemonList = this.sortPokemonList(pokedex);
      this.filteredPokemonList = [...this.pokemonList]; // Initialize with full list
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
    const tierOrder: { [key: string]: number } = {
      'Uber': 1,
      'OU': 2,
      'UU': 3,
      'RU': 4,
      'NU': 5,
      'PU': 6,
      'LC': 7,
      'Illegal': 8 // For any Pokemon with an invalid tier
    };
    
    return [...pokemonList].sort((a, b) => {
      // First sort by tier
      const tierA = a.tier || 'Illegal';
      const tierB = b.tier || 'Illegal';
      
      const tierCompare = (tierOrder[tierA] || 999) - (tierOrder[tierB] || 999);
      
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
    this.router.navigate(['/teambuilder/ability']);
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
      
      // Apply tier filter
      const matchesTier = this.selectedTier ? 
        pokemon.tier?.toLowerCase() === this.selectedTier.toLowerCase() : 
        true;
      
      return matchesSearch && matchesType && matchesTier;
    });
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